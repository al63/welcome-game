import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { PollTurnAPIRequest } from "../models";
import { Filter } from "mongodb";
import { GameState } from "@/app/util/GameTypes";

// Poll API to inform the client if they are waiting for everyone to finish their turn or if it's time to play
export async function GET(request: NextRequest) {
  try {
    const req = (await request.json()) as PollTurnAPIRequest;
    const client = await clientPromise;
    const db = client.db("wtypf");

    const gameQuery: Filter<GameState> = { id: req.gameId };
    const gameState = await db.collection<GameState>("game_states").findOne(gameQuery);
    if (!gameState) {
      return NextResponse.json("Game not found", { status: 404 });
    }

    if (req.turn == gameState.turn) {
      return NextResponse.json({ result: "RESUME" }, { status: 200 });
    } else if (req.turn == gameState.turn + 1) {
      return NextResponse.json({ result: "WAIT" }, { status: 200 });
    } else {
      return NextResponse.json(
        { result: "ERROR", error: "Game Turn: " + gameState.turn + ", Requested Turn: " + req.turn },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}
