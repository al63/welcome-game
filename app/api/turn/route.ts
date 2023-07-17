import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { CreateTurnAPIRequest, PlayerStateMap, ShuffleTurnException, TurnAction } from "../models";
import { Db, Document, Filter, UpdateFilter } from "mongodb";
import { PlayerState, PreviousPlacements } from "@/app/util/playerTypes";
import { FinalScores, GameState, PlayerMetadataMap } from "@/app/util/gameTypes";
import { computeScore, getEstatesResult } from "@/app/util/scoring";
import { PlanCard } from "@/app/util/cardTypes";
import { ActiveCards, drawCards, shuffleWithSeedAndDrawOffset } from "../utils/deck";

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
    // Build the update request body for the player. If they're the first to complete a city plan,
    // they're eligible to shuffle and we won't mutate their turn until they have provided an answer on shuffling
    const newPlayerState = consolidateUpdate(req.action, playerState, gameState.turn, gameState.plans, req.shuffle);
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

    // only update the gameState's completed plans / shuffle as well as ONLY the current player's turn (partial update)
    const gameStateUpdated = await updateGameState(db, newPlayerState, gameState, req.shuffle);

    if (!gameStateUpdated) {
      return NextResponse.json("Unable to update the game state", { status: 500 });
    }

    // grab the new game state and new player states to determine if the game is over / should advance turn
    const finalGameState = await sanityCheckGameStateAndAdvanceTurn(db, req.gameId);

    return NextResponse.json(
      { gameState: finalGameState, playerState: newPlayerState, promptReshuffle: false },
      { status: 200 }
    );
  } catch (e: any) {
    if (e instanceof ShuffleTurnException) {
      return NextResponse.json({ promptReshuffle: true }, { status: 200 });
    }
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}

function consolidateUpdate(
  action: TurnAction,
  playerState: PlayerState,
  turn: number,
  plans: PlanCard[],
  shuffleForCompletedPlan: boolean | undefined
) {
  const newPlayerState: PlayerState = {
    ...playerState,
  };

  const previousPlacements: PreviousPlacements = {
    houses: [],
  };

  newPlayerState.lastEvent = "";

  switch (action.type) {
    case "refusal":
      newPlayerState.permitRefusals++;
      newPlayerState.lastEvent = `[${turn}] ${newPlayerState.playerId} has no valid moves and has received a permit refusal.`;
      newPlayerState.previousPlacements = null;
      return newPlayerState;
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
      previousPlacements.fence = action.fencePosition;
      break;
    case "estate":
      newPlayerState.estateModifiers[action.sizeIncreased - 1]++;
      let estateLastEvent = `[${turn}] ${newPlayerState.playerId} upgraded the value of estates size ${action.sizeIncreased}`;
      newPlayerState.lastEvent = estateLastEvent;
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
      previousPlacements.houses.push({
        position: action.bisPosition,
        modifier: "BIS",
      });
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

  // overwrite house modifier for BIS for previous placements, since it will be undefined
  previousPlacements.houses.push({
    position: action.housePosition,
    modifier: action.type === "bis" ? "BIS" : action.house.modifier,
  });
  newPlayerState.previousPlacements = previousPlacements;

  // let lastEvent = `[${turn}] ${newPlayerState.playerId} played value ${action.house.value}`;
  // if (action.house.modifier) {
  //   lastEvent += ` ${action.house.modifier}`;
  // }
  // lastEvent += ` on row ${action.housePosition[0]} column ${action.housePosition[1]}`;
  // if (action.type == "estate") {
  //   lastEvent += `, upgrading the value of estates size ${action.sizeIncreased}`;
  // } else if (action.type == "bis") {
  //   lastEvent += ` with the BIS on row ${action.bisPosition[0]} column ${action.bisPosition[1]}`;
  // }

  // newPlayerState.lastEvent = lastEvent;
  return validateCityPlanCompletion(newPlayerState, plans, turn, shuffleForCompletedPlan);
}

function validateCityPlanCompletion(
  playerState: PlayerState,
  plans: PlanCard[],
  turn: number,
  shuffleForCompletedPlan: boolean | undefined
): PlayerState {
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
    let planCompleted = false;

    // player has already completed the plan, don't check it twice
    if (newPlayerState.completedPlans[idx] > 0) {
      return;
    }
    planCompleted = plan.requirements.every(function (req) {
      const size = req.size - 1;
      // look at each size of estates
      const estatesBucket = combined[size];
      // filter out arrays already being used for plans
      const availableEstates = estatesBucket.filter(function (e) {
        return !e.usedForPlan;
      });
      // check the length of this array to determine if there's even enough houses that meet the criteria of the plan
      return availableEstates.length >= req.quantity;
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
        for (let i = 0; i < req.quantity; i++) {
          if (availableEstates.length == 0) {
            break;
          }
          const estate = availableEstates[i];
          for (let j = estate.columns[0]; j <= estate.columns[1]; j++) {
            switch (estate.row) {
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

      if (planCompleted && newPlayerState.completedPlans[idx] == 0) {
        if (plan.turnCompleted != -1 && plan.turnCompleted < turn) {
          newPlayerState.completedPlans[idx] = plan.secondValue;
          newPlayerState.lastEvent = `[${turn}] ${newPlayerState.playerId} has completed City Plan ${idx + 1} for ${
            plan.secondValue
          } points!`;
        } else {
          newPlayerState.completedPlans[idx] = plan.firstValue;
          newPlayerState.lastEvent = `[${turn}] ${newPlayerState.playerId} has completed City Plan ${idx + 1} for ${
            plan.firstValue
          } points!`;
          // if a player is first to complete a plan, they must be prompted to shuffle
          if (shuffleForCompletedPlan == null) {
            throw new ShuffleTurnException();
          }
        }
      }
    }
  });

  return newPlayerState;
}

async function sanityCheckGameStateAndAdvanceTurn(db: Db, gameId: string): Promise<GameState> {
  const gameQuery: Filter<GameState> = { id: gameId };
  const gameState = await db.collection<GameState>("game_states").findOne(gameQuery);

  if (!gameState) {
    throw new Error("Unable to retrieve game state while checking to advance turn");
  }

  const newGameState = { ...gameState };
  const nextTurn = gameState.turn + 1;

  let currentTurnLog = [...gameState.latestEventLog];
  const advanceTurn = Object.keys(newGameState.players).every(function (e) {
    return newGameState.players[e].turn == nextTurn;
  });

  const playerStates = db.collection<PlayerState>("player_states");
  const playerStateQuery: Filter<PlayerState> = { gameId: gameId };
  const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

  const playerStatesMap: PlayerStateMap = {};
  for await (const doc of playerStatesCursor) {
    delete (doc as any)["_id"];
    playerStatesMap[doc.playerId] = doc;
  }

  if (advanceTurn) {
    newGameState.turn = nextTurn;
    const playerIdKeys = Object.keys(playerStatesMap);
    playerIdKeys.forEach((key) => {
      const gameCompleted = isGameCompleted(playerStatesMap[key]);
      if (gameCompleted) {
        newGameState.completed = true;
        // do the painstaking task of adding the specifics here later
        currentTurnLog = addEventLog(currentTurnLog, `[${nextTurn}] ${key} has completed the game!`);
      }
    });

    let seed = gameState.seed;
    let shuffleOffset = newGameState.shuffleOffset + 1;
    const cardsDrawn = shuffleOffset * 3;
    const deckExhausted = cardsDrawn % 81 == 0;
    if (deckExhausted) {
      currentTurnLog = addEventLog(currentTurnLog, `[${nextTurn}] The deck has been exhausted -- shuffling!`);
      shuffleOffset = 1;
      seed = new Date().getTime();
    }
    const shuffledDeck = shuffleWithSeedAndDrawOffset(seed, shuffleOffset);
    const activeCards: ActiveCards = drawCards(shuffledDeck);
    newGameState.revealedCardValues = activeCards.revealedNumbers;
    newGameState.revealedCardModifiers = activeCards.revealedModifiers.map((gameCard) => gameCard.backingType);
    newGameState.seed = seed;
    newGameState.shuffleOffset = shuffleOffset;
  }

  if (advanceTurn && newGameState.completed) {
    currentTurnLog = addEventLog(currentTurnLog, "The game is over! Calculating scores...");
    const finalScores = await calculateFinalScores(db, newGameState.players, gameState.id);
    newGameState.players = finalScores.playerMetadataMap;
    finalScores.scoringInfo.forEach((info) => {
      currentTurnLog = addEventLog(currentTurnLog, `${info.playerId}: ${info.score}`);
    });
    currentTurnLog = addEventLog(currentTurnLog, `Congratulations to ${finalScores.scoringInfo[0].playerId}!`);
  }

  newGameState.latestEventLog = currentTurnLog;
  const gameFilter: Filter<Document> = { id: newGameState.id };
  const gameBody: UpdateFilter<Document> = {
    $set: {
      ...newGameState,
    },
  };

  const gameRes = await db.collection("game_states").updateOne(gameFilter, gameBody);
  if (!gameRes.acknowledged) {
    throw new Error("Unable to update the game state in 'sanityCheckGameStateAndAdvanceTurn'");
  }

  return newGameState;
}

// This only updates if a plan has been completed or shuffling the deck for completing a city plan first
async function updateGameState(
  db: Db,
  currentPlayerState: PlayerState,
  gameState: GameState,
  shuffle: boolean | undefined
): Promise<number> {
  const newGameState = {
    ...gameState,
  };
  const currentTurn = gameState.turn;
  let currentTurnLog = [...gameState.latestEventLog];
  let updatedPlanIdxs: number[] = [];
  let isShuffled = false;
  currentTurnLog = addEventLog(currentTurnLog, currentPlayerState.lastEvent);

  // Update the completed plans for the GameState so that players can determine if
  // they get first or second score for completing a plan
  currentPlayerState.completedPlans.forEach((_, idx) => {
    if (
      (gameState.plans[idx].completed != true || gameState.plans[idx].turnCompleted == gameState.turn) &&
      currentPlayerState.completedPlans[idx] > 0
    ) {
      newGameState.plans[idx].completed = true;
      newGameState.plans[idx].turnCompleted = currentTurn;
      updatedPlanIdxs.push(idx);
      if (shuffle != null) {
        if (shuffle) {
          isShuffled = true;
          newGameState.shuffleOffset = 1;
          const seed = new Date().getTime();
          const shuffledDeck = shuffleWithSeedAndDrawOffset(seed, 1);
          const activeCards: ActiveCards = drawCards(shuffledDeck);
          newGameState.seed = seed;
          newGameState.revealedCardValues = activeCards.revealedNumbers;
          newGameState.revealedCardModifiers = activeCards.revealedModifiers.map((gameCard) => gameCard.backingType);
          currentTurnLog = addEventLog(
            currentTurnLog,
            `[${currentTurn}] ${currentPlayerState.playerId} has decided to shuffle the deck.`
          );
        }
      }
    }
  });

  const nextTurn = gameState.turn + 1;
  newGameState.players[currentPlayerState.playerId].turn = nextTurn;
  newGameState.latestEventLog = currentTurnLog;

  const gameQuery: Filter<Document> = { id: gameState.id };
  const setBody: Record<string, any> = {
    [`players.${currentPlayerState.playerId}`]: newGameState.players[currentPlayerState.playerId],
  };
  updatedPlanIdxs.forEach((val) => {
    setBody[`plans.${val}.completed`] = newGameState.plans[val].completed;
    setBody[`plans.${val}.turnCompleted`] = newGameState.plans[val].turnCompleted;
  });

  if (isShuffled) {
    setBody["shuffleOffset"] = newGameState.shuffleOffset;
    setBody["seed"] = newGameState.seed;
    setBody["revealedCardValues"] = newGameState.revealedCardValues;
    setBody["revealedCardModifiers"] = newGameState.revealedCardModifiers;
  }

  setBody["latestEventLog"] = currentTurnLog;
  // only do a partial update for what has changed to avoid players clobbering the game state
  const gameRes = await db.collection("game_states").findOneAndUpdate(gameQuery, {
    $set: setBody,
  });
  return gameRes.ok;
}

async function calculateFinalScores(db: Db, currPlayerMap: PlayerMetadataMap, gameId: string): Promise<FinalScores> {
  const playerStates = db.collection<PlayerState>("player_states");
  const playerStateQuery: Filter<PlayerState> = { gameId: gameId };
  const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

  const playerStatesMap: PlayerStateMap = {};
  for await (const doc of playerStatesCursor) {
    delete (doc as any)["_id"];
    playerStatesMap[doc.playerId] = doc;
  }

  const newPlayerMetadataState = {
    ...currPlayerMap,
  };

  const scores = Object.keys(playerStatesMap).map((playerId) => {
    const userScore = computeScore(playerId, playerStatesMap);

    return {
      playerId,
      score: userScore?.summation ?? 0,
      estates: userScore?.estates,
    };
  });

  // update player metadata as well
  scores.forEach((score) => {
    newPlayerMetadataState[score.playerId].score = score.score;
  });

  scores.sort((x, y) => {
    const diff = y.score - x.score;
    if (diff !== 0) {
      return diff;
    }

    // break tie breakers by
    // 1) most estates
    // 2) most of each incremental estate starting at 1
    const yCount =
      y.estates?.reduce((accum, cur) => {
        return accum + cur.count;
      }, 0) ?? 0;
    const xCount =
      x.estates?.reduce((accum, cur) => {
        return accum + cur.count;
      }, 0) ?? 0;

    const estatesDiff = yCount - xCount;
    if (estatesDiff !== 0) {
      return estatesDiff;
    }

    for (let i = 0; i < (y.estates?.length ?? 0); i++) {
      const ed = (y.estates?.[i].count ?? 0) - (x.estates?.[i].count ?? 0);
      if (ed !== 0) {
        return ed;
      }
    }

    return 0;
  });

  const scoringInfo = scores.map((scores) => {
    return {
      score: scores.score,
      playerId: scores.playerId,
    };
  });

  return {
    scoringInfo,
    playerMetadataMap: newPlayerMetadataState,
  };
}

function addEventLog(log: string[], val: string): string[] {
  const newLog = [...log];

  if (val.trim() == "") {
    return newLog;
  }

  if (newLog.length > 15) {
    newLog.shift();
  }
  newLog.push(val);
  return newLog;
}

function isGameCompleted(playerState: PlayerState): boolean {
  let isGameCompleted = false;

  // determine if a player has ended the game via completing every single plan
  const planEndCondition = playerState.completedPlans.every(function (val) {
    return val > 0;
  });

  if (planEndCondition) {
    isGameCompleted = true;
  } else if (playerState.permitRefusals == 3) {
    // determine if a player has ended the game via using all of their permit refusals (idx 3)
    isGameCompleted = true;
  } else {
    // determine if a player has ended the game via building in every single spot
    const rowOneCompleted = playerState.housesRowOne.every(function (house) {
      return house != null;
    });
    const rowTwoCompleted = playerState.housesRowTwo.every(function (house) {
      return house != null;
    });
    const rowThreeCompleted = playerState.housesRowThree.every(function (house) {
      return house != null;
    });

    if (rowOneCompleted && rowTwoCompleted && rowThreeCompleted) {
      isGameCompleted = true;
    }
  }

  return isGameCompleted;
}
