import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { CreateTurnAPIRequest, TurnAction } from "../models";
import { Document, Filter, UpdateFilter } from "mongodb";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { GameState } from "@/app/util/GameTypes";
import { getEstatesResult } from "@/app/util/Scoring";
import { PlanCard } from "@/app/util/CardTypes";

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
    // Build the update request body for the player
    const newPlayerState = consolidateUpdate(req.action, playerState, gameState.plans);
    const filter: Filter<Document> = { gameId: req.gameId, playerId: req.playerId };
    const body: UpdateFilter<Document> = {
      $set: {
        ...newPlayerState,
      },
    };

    const res = await db.collection("player_states").updateOne(filter, body);
    if (res.matchedCount != 1) {
      return NextResponse.json("Did not find any player state matching the given parameters", { status: 500 });
    }
    if (res.modifiedCount != 1) {
      return NextResponse.json("Unable to update the player state", { status: 500 });
    }

    // update game state on completed plans / game end
    // const newGameState = updateGameState(newPlayerState, gameState);

    // if it was the last player, increment game state turn
    return NextResponse.json(newPlayerState, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

function consolidateUpdate(action: TurnAction, playerState: PlayerState, plans: PlanCard[]) {
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
      newPlayerState.estateModifiers[action.sizeIncreased]++;
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

  let lastEvent = "";
  lastEvent = newPlayerState.playerId + " played " + action.house.value;
  if (action.house.modifier) {
    lastEvent += " " + action.house.modifier;
  }
  lastEvent += " on row " + action.housePosition[0] + " column " + action.housePosition[1];
  if (action.type == "bis") {
    lastEvent += " with the BIS on row" + action.bisPosition[0] + " column " + action.bisPosition[1];
  }
  newPlayerState.lastEvent = lastEvent;
  newPlayerState.turn++;
  return validateCityPlanCompletion(newPlayerState, plans);
}

export function validateCityPlanCompletion(playerState: PlayerState, plans: PlanCard[]): PlayerState {
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
      // look at each size of estates
      const estatesBucket = combined[req.size];
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
        // look at each size of estates
        const estatesBucket = combined[req.size];
        // filter out arrays already being used for plans
        const availableEstates = estatesBucket.filter(function (e) {
          return !e.usedForPlan;
        });
        // for each requirement, start marking houses as used for a plan up to the quantity of the requirement
        for (let i = 0; i <= req.quantity; i++) {
          const estate = availableEstates[i];
          for (let j = estate.columns[0]; j < estate.columns[1]; j++) {
            switch (req.size) {
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
      } else {
        newPlayerState.completedPlans[idx] = plan.firstValue;
      }
    }
  });

  return newPlayerState;
}

// function updateGameState(playerState: PlayerState, gameState: GameState): GameState {
  
// }
