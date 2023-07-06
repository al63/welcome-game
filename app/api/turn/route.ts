import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { CreateTurnAPIRequest, PlayerStateMap, TurnAction } from "../models";
import { Db, Document, Filter, UpdateFilter } from "mongodb";
import { PlayerState, PlayerStates } from "@/app/util/PlayerTypes";
import { GameState, PlayerMetadataMap } from "@/app/util/GameTypes";
import { computeScore, getEstatesResult } from "@/app/util/Scoring";
import { PlanCard } from "@/app/util/CardTypes";
import { ActiveCards, drawCards, shuffleWithSeedAndDrawOffset } from "../utils/Deck";

// User takes a turn. This means either
// 1) playing a card
// 2) taking a permit refusal
//
// This API will need to:
// (1) check if the estates present meet the criteria of a city plan, mark it completed,
//     and check GameState to see if anyone else had claimed it on prior turns.
// (2) take in an event log string and store it to the game state as the most recent turn log.
//     (a) Need to write an event log for CityPlan completions
// (3) calculate scores at game end and store it in the GameState.
// (4) check if every player has played (PlayerState.turn == GameState.turn + 1)
//     and if true, advance the GameState.turn by one.
// (5) GAME END CONDITIONS:
//     (a) player uses all of their permit refusals
//     (b) player builds a house on every single space
//     (c) player completes all three city plans
//
// There's no validation on if the board or turns taken are valid.
// Validate that the PlayerState.turn == GameState.turn first before saving to DB.
// TODO: poll API, pass in turn
// response here is "please hold" or "new turn has begun"

export async function POST(request: NextRequest) {
  try {
    const req = (await request.json()) as CreateTurnAPIRequest;
    const client = await clientPromise;
    const db = client.db("wtypf");

    // Get the GameState to validate that
    // (1) the game exists
    // (2) the turns are equal before updating
    const gameQuery: Filter<GameState> = { id: req.gameId };
    const gameState = await db.collection<GameState>("game_states").findOne(gameQuery);
    if (!gameState) {
      return NextResponse.json("Game not found", { status: 404 });
    }

    if (gameState.turn != req.turn) {
      return NextResponse.json("Game state turn not equal to player state turn", { status: 400 });
    }

    const playerQuery: Filter<PlayerState> = { gameId: req.gameId, playerId: req.playerId };
    const playerState = await db.collection<PlayerState>("player_states").findOne(playerQuery);
    if (!playerState) {
      return NextResponse.json("Player not found", { status: 404 });
    }

    if (req.turn != gameState.players[playerState.playerId].turn) {
      return NextResponse.json("Requested turn is not equal to the known player state's turn", { status: 400 });
    }
    // Build the update request body for the player
    const newPlayerState = consolidateUpdate(req.action, playerState, gameState.turn, gameState.plans);
    const playerFilter: Filter<Document> = { gameId: req.gameId, playerId: req.playerId };
    const playerBody: UpdateFilter<Document> = {
      $set: {
        ...newPlayerState,
      },
    };

    const playerRes = await db.collection("player_states").updateOne(playerFilter, playerBody);
    if (playerRes.matchedCount != 1) {
      return NextResponse.json("Did not find any player state matching the given parameters", { status: 500 });
    }
    if (playerRes.modifiedCount != 1) {
      return NextResponse.json("Unable to update the player state", { status: 500 });
    }

    // update game state on completed plans / game end
    const newGameState = await updateGameState(db, newPlayerState, gameState);
    const gameFilter: Filter<Document> = { id: gameState.id };
    const gameBody: UpdateFilter<Document> = {
      $set: {
        ...newGameState,
      },
    };

    const gameRes = await db.collection("game_states").updateOne(gameFilter, gameBody);
    if (gameRes.matchedCount != 1) {
      return NextResponse.json("Did not find any game state matching the given parameters", { status: 500 });
    }
    if (gameRes.modifiedCount != 1) {
      return NextResponse.json("Unable to update the game state", { status: 500 });
    }

    return NextResponse.json({ gameState: newGameState, playerState: newPlayerState }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}

function consolidateUpdate(action: TurnAction, playerState: PlayerState, turn: number, plans: PlanCard[]) {
  const newPlayerState = {
    ...playerState,
  };
  switch (action.type) {
    case "refusal":
      playerState.permitRefusals++;
      playerState.lastEvent = playerState.playerId + " has no valid moves and has received a permit refusal.";
      return playerState;
    case "fence":
      if (action.fencePosition[0] == 0) {
        newPlayerState.fencesRowOne[action.fencePosition[1]] = true;
      }
      if (action.fencePosition[0] == 1) {
        newPlayerState.fencesRowTwo[action.fencePosition[1]] = true;
      }
      if (action.fencePosition[0] == 2) {
        newPlayerState.fencesRowThree[action.fencePosition[1]] = true;
      }
      break;
    case "estate":
      newPlayerState.estateModifiers[action.sizeIncreased - 1]++;
      break;
    case "bis":
      if (action.bisPosition[0] == 0) {
        newPlayerState.housesRowOne[action.bisPosition[1]] = action.bisHouse;
      }
      if (action.bisPosition[0] == 1) {
        newPlayerState.housesRowTwo[action.bisPosition[1]] = action.bisHouse;
      }
      if (action.bisPosition[0] == 2) {
        newPlayerState.housesRowThree[action.bisPosition[1]] = action.bisHouse;
      }
      break;
  }

  if (action.housePosition[0] == 0) {
    newPlayerState.housesRowOne[action.housePosition[1]] = action.house;
  }
  if (action.housePosition[0] == 1) {
    newPlayerState.housesRowTwo[action.housePosition[1]] = action.house;
  }
  if (action.housePosition[0] == 2) {
    newPlayerState.housesRowThree[action.housePosition[1]] = action.house;
  }

  let lastEvent = "[" + turn + "] ";
  lastEvent += newPlayerState.playerId + " played value " + action.house.value;
  if (action.house.modifier) {
    lastEvent += " " + action.house.modifier;
  }
  lastEvent += " on row " + action.housePosition[0] + " column " + action.housePosition[1];
  if (action.type == "estate") {
    lastEvent += ", upgrading the value of estates size " + action.sizeIncreased;
  }
  if (action.type == "bis") {
    lastEvent += " with the BIS on row " + action.bisPosition[0] + " column " + action.bisPosition[1];
  }
  newPlayerState.lastEvent = lastEvent;
  return validateCityPlanCompletion(newPlayerState, plans);
}

function validateCityPlanCompletion(playerState: PlayerState, plans: PlanCard[]): PlayerState {
  const newPlayerState = {
    ...playerState,
  };

  const estatesRowOne = getEstatesResult(newPlayerState.fencesRowOne, playerState.housesRowOne);
  const estatesRowTwo = getEstatesResult(newPlayerState.fencesRowTwo, playerState.housesRowTwo);
  const estatesRowThree = getEstatesResult(newPlayerState.fencesRowThree, playerState.housesRowThree);

  // take our estate result, and merge them all together with additional row info
  // combined goes from size -> {row, columns, usedForPlan}[]
  const combined = Array(6)
    .fill(null)
    .map((_, index) => {
      return [
        ...estatesRowOne[index].map((res) => {
          return {
            ...res,
            row: 0,
          };
        }),
        ...estatesRowTwo[index].map((res) => {
          return {
            ...res,
            row: 1,
          };
        }),
        ...estatesRowThree[index].map((res) => {
          return {
            ...res,
            row: 2,
          };
        }),
      ];
    });

  plans.forEach(function (plan, idx) {
    let planCompleted = true;
    plan.requirements.forEach(function (req) {
      const size = req.size - 1;
      // look at each size of estates
      const estatesBucket = combined[size];
      // filter out arrays already being used for plans
      const availableEstates = estatesBucket.filter(function (e) {
        return !e.usedForPlan;
      });
      // check the length of this array to determine if there's even enough houses that meet the criteria of the plan
      if (availableEstates.length < req.quantity) {
        planCompleted = false;
      }
    });
    // update house rows to be used for plans
    if (planCompleted) {
      plan.requirements.forEach(function (req) {
        const size = req.size - 1;
        // look at each size of estates
        const estatesBucket = combined[size];
        // filter out arrays already being used for plans
        const availableEstates = estatesBucket.filter(function (e) {
          return !e.usedForPlan;
        });
        // for each requirement, start marking houses as used for a plan up to the quantity of the requirement
        for (let i = 0; i <= req.quantity; i++) {
          const estate = availableEstates[i];
          for (let j = estate.columns[0]; j < estate.columns[1]; j++) {
            switch (size) {
              case 0:
                const colRowOne = newPlayerState.housesRowOne[j];
                if (colRowOne != null) {
                  colRowOne.usedForPlan = true;
                }
                break;
              case 1:
                const colRowTwo = newPlayerState.housesRowTwo[j];
                if (colRowTwo != null) {
                  colRowTwo.usedForPlan = true;
                }
                break;
              case 2:
                const colRowThree = newPlayerState.housesRowThree[j];
                if (colRowThree != null) {
                  colRowThree.usedForPlan = true;
                }
                break;
            }
          }
          availableEstates[i].usedForPlan = true;
        }
      });

      if (plan.completed) {
        newPlayerState.completedPlans[idx] = plan.secondValue;
        newPlayerState.lastEvent += " and has completed City Plan " + idx + "!";
      } else {
        newPlayerState.completedPlans[idx] = plan.firstValue;
      }
    }
  });

  return newPlayerState;
}

async function updateGameState(db: Db, currentPlayerState: PlayerState, gameState: GameState): Promise<GameState> {
  const newGameState = {
    ...gameState,
  };
  const currentTurn = gameState.turn;
  const currentTurnLog = [...gameState.latestEventLog];
  currentTurnLog.push(currentPlayerState.lastEvent);

  // Update the completed plans for the GameState so that players can determine if
  // they get first or second score for completing a plan
  currentPlayerState.completedPlans.forEach((_, idx) => {
    if (gameState.plans[idx].completed != true && currentPlayerState.completedPlans[idx] > 0) {
      newGameState.plans[idx].completed = true;
      currentTurnLog.push(
        "[" + currentTurn + "] " + currentPlayerState.playerId + " is the first to complete City Plan " + idx + "!"
      );
    }
  });

  // determine if a player has ended the game via completing every single plan
  const planEndCondition = currentPlayerState.completedPlans.every(function (val) {
    return val > 0;
  });

  if (planEndCondition) {
    newGameState.completed = true;
    currentTurnLog.push("[" + currentTurn + "] " + currentPlayerState.playerId + " has completed all city plans!");
  }

  // determine if a player has ended the game via using all of their permit refusals (idx 3)
  if (currentPlayerState.permitRefusals == 3) {
    newGameState.completed = true;
    currentTurnLog.push(
      "[" + currentTurn + "] " + currentPlayerState.playerId + " has used all of their permit refusals!"
    );
  }

  // determine if a player has ended the game via building in every single spot
  const rowOneCompleted = currentPlayerState.housesRowOne.every(function (house) {
    return house != null;
  });
  const rowTwoCompleted = currentPlayerState.housesRowTwo.every(function (house) {
    return house != null;
  });
  const rowThreeCompleted = currentPlayerState.housesRowThree.every(function (house) {
    return house != null;
  });

  if (rowOneCompleted && rowTwoCompleted && rowThreeCompleted) {
    newGameState.completed = true;
    currentTurnLog.push(
      "[" + currentTurn + "] " + currentPlayerState.playerId + " has built every single housing development!"
    );
  }

  const nextTurn = gameState.turn + 1;
  newGameState.players[currentPlayerState.playerId].turn = nextTurn;
  const advanceTurn = Object.keys(newGameState.players).every(function (e) {
    return newGameState.players[e].turn == nextTurn;
  });
  // Advance the GameState turn if all players have taken the current GameState turn and the game isn't over
  if (!newGameState.completed) {
    if (advanceTurn) {
      currentTurnLog.push("[" + currentTurn + "] " + "All players have taken their turn!");
      currentTurnLog.push("Turn " + nextTurn + " has begun.");
      newGameState.turn++;
    }
  } else {
    if (advanceTurn) {
      let winningPlayer = "";
      let winningPlayerScore = 0;
      currentTurnLog.push("The game is over! Calculating scores...");
      const finalPlayersResult = await calculateFinalScores(db, newGameState.players);
      newGameState.players = finalPlayersResult;
      Object.keys(finalPlayersResult).forEach((player, _) => {
        if (finalPlayersResult[player].score > winningPlayerScore) {
          winningPlayer = player;
          winningPlayerScore = finalPlayersResult[player].score;
        }
        currentTurnLog.push(player + ": " + finalPlayersResult[player].score);
      });
      currentTurnLog.push("Congratulations to " + winningPlayer + "!");
    } else {
      currentTurnLog.push("The game is ending! Waiting for all players to finish...");
    }
  }

  newGameState.latestEventLog = currentTurnLog;
  const shuffledDeck = shuffleWithSeedAndDrawOffset(newGameState.seed, gameState.turn);
  const activeCards: ActiveCards = drawCards(shuffledDeck);
  newGameState.revealedCardValues = activeCards.revealedNumbers;
  newGameState.revealedCardModifiers = activeCards.revealedModifiers.map((gameCard) => gameCard.backingType);
  return newGameState;
}

async function calculateFinalScores(db: Db, currPlayerMap: PlayerMetadataMap): Promise<PlayerMetadataMap> {
  const playerStates = db.collection<PlayerState>("player_states");
  const playerStateQuery: Filter<PlayerState> = { gameId: currPlayerMap.gameId };
  const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

  const playerStatesMap: PlayerStateMap = {};
  for await (const doc of playerStatesCursor) {
    delete (doc as any)["_id"];
    playerStatesMap[doc.playerId] = doc;
  }
  const newPlayerMetadataState = {
    ...currPlayerMap,
  };

  Object.keys(playerStatesMap).forEach((playerId, _) => {
    const userScore = computeScore(playerId, playerStatesMap);
    newPlayerMetadataState[playerId].score = userScore?.summation || 0;
  });

  return newPlayerMetadataState;
}
