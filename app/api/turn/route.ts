import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import {
  BISAction,
  CreateTurnAPIRequest,
  FenceAction,
  PermitRefusalAction,
  StandardAction,
  EstateAction,
  TurnAction,
} from "../models";
import { Document, Filter, UpdateFilter } from "mongodb";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { GameState } from "@/app/util/GameTypes";
import { getEstatesResult } from "@/app/util/Scoring";

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
    // Build the update request body
    const newPlayerState = consolidateUpdate(req.action, playerState);
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
    // if it was the last player, increment game state turn
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

function consolidateUpdate(action: TurnAction, playerState: PlayerState) {
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
  return validateCityPlanCompletion(newPlayerState);
}

function validateCityPlanCompletion(playerState: PlayerState) {
  const newPlayerState = {
    ...playerState,
  };

  const estatesRowOne = getEstatesResult(newPlayerState.fencesRowOne, playerState.housesRowOne);
  const estatesRowTwo = getEstatesResult(newPlayerState.fencesRowTwo, playerState.housesRowTwo);
  const estatesRowThree = getEstatesResult(newPlayerState.fencesRowThree, playerState.housesRowThree);

  // do this later fml
  return newPlayerState;
}
