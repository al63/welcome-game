import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { Filter, Db } from "mongodb";
import { GameState } from "@/app/util/GameTypes";
import { PlayerStateMap, PollTurnAPIResponse } from "../models";
import { PlayerState } from "@/app/util/PlayerTypes";

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
      return NextResponse.json<PollTurnAPIResponse>(
        { result: "RESUME", gameState, playerStates: await getPlayerStateMap(db, gameId) },
        { status: 200 }
      );
    } else if (turn == gameState.turn + 1) {
      return NextResponse.json<PollTurnAPIResponse>({ result: "WAIT" }, { status: 200 });
    } else {
      return NextResponse.json<PollTurnAPIResponse>(
        { result: "ERROR", error: `Game Turn: ${gameState.turn}, Requested Turn: ${turn}` },
        { status: 400 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}

async function getPlayerStateMap(db: Db, gameId: string): Promise<PlayerStateMap> {
  const playerStates = db.collection<PlayerState>("player_states");
  const playerStateQuery: Filter<PlayerState> = { gameId: gameId };
  const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

  const playerStatesMap: PlayerStateMap = {};
  for await (const doc of playerStatesCursor) {
    delete (doc as any)["_id"];
    playerStatesMap[doc.playerId] = doc;
  }

  return playerStatesMap;
}
