import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { Filter } from "mongodb";
import { GameState } from "@/app/util/GameTypes";
import { PollTurnAPIResponse } from "../models";

// Poll API to inform the client if they are waiting for everyone to finish their turn or if it's time to play
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const gameId = params.get("gameId") ?? undefined;
    const turn = Number(params.get("turn")) ?? undefined;

    if (!gameId || !turn) {
      return NextResponse.json("Missing parameters", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("wtypf");

    const gameQuery: Filter<GameState> = { id: gameId };
    const gameState = await db.collection<GameState>("game_states").findOne(gameQuery);
    if (!gameState) {
      return NextResponse.json("Game not found", { status: 404 });
    }

    if (turn == gameState.turn) {
      return NextResponse.json<PollTurnAPIResponse>({ result: "RESUME", gameState }, { status: 200 });
    } else if (turn == gameState.turn + 1) {
      return NextResponse.json<PollTurnAPIResponse>({ result: "WAIT" }, { status: 200 });
    } else {
      return NextResponse.json<PollTurnAPIResponse>(
        { result: "ERROR", error: "Game Turn: " + gameState.turn + ", Requested Turn: " + turn },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}
