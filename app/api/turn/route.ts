import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { CreateGameResponse, CreateTurnAPIRequest } from "../models";
import { Document, Filter, UpdateFilter } from "mongodb";
import { PlayerState } from "@/app/util/PlayerTypes";
import { GameState } from "@/app/util/GameTypes";

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

    const filter: Filter<Document> = { gameId: req.gameId, playerId: req.playerId };
    const body: UpdateFilter<Document> = {
      $set: {
        turn: req.turn,
        housesRowOne: req.housesRowOne,
        housesRowTwo: req.housesRowTwo,
        housesRowThree: req.housesRowThree,
        fencesRowOne: req.fencesRowOne,
        fencesRowTwo: req.fencesRowTwo,
        fencesRowThree: req.fencesRowThree,
        permitRefusals: req.permitRefusals,
      },
    };

    // Get the GameState to validate that the turns are equal before updating
    const query: Filter<GameState> = { id: req.gameId };
    const gameState = await db.collection<GameState>("game_states").findOne(query);
    if (!gameState) {
      return NextResponse.json("Game not found", { status: 404 });
    }

    if (gameState.turn != req.turn) {
        return NextResponse.json("Game state turn not equal to player state turn", { status: 400 });
    }

    const res = await db.collection("player_states").updateOne(filter, body);
    if (res.matchedCount != 1) {
      return NextResponse.json("Did not find any player state matching the given parameters", { status: 500 });
    }
    if (res.modifiedCount != 1) {
      return NextResponse.json("Unable to update the player state", { status: 500 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

/*

export interface PlayerState {
  playerId: string;
  gameId: string;
  score: number;
  turn: number;
  housesRowOne: Array<House | null>;
  housesRowTwo: Array<House | null>;
  housesRowThree: Array<House | null>;
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  completedPlans: number[];
  estateModifiers: number[];
  permitRefusals: number;
}

*/
