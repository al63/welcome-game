import "server-only";
import { GameState } from "@/app/util/GameTypes";
import { PlayerState } from "@/app/util/PlayerTypes";
import clientPromise from "@/lib/mongodb";
import { Filter } from "mongodb";
import { GetGameActionResponse, PlayerStateMap } from "../models";

export async function getGameServerAction(id: string, player: string): Promise<GetGameActionResponse | null> {
  try {
    const query: Filter<GameState> = { id };

    // Grab game state
    const client = await clientPromise;
    const db = client.db("wtypf");
    const gameState = await db.collection<GameState>("game_states").findOne(query);
    if (!gameState) {
      return null;
    }
    delete (gameState as any)["_id"];

    // validate requested player exists in the game
    const players = Object.keys(gameState.players);
    if (!players || !players.includes(player)) {
      return null;
    }

    // Grab all player states associated with a game
    const playerStates = db.collection<PlayerState>("player_states");
    const playerStateQuery: Filter<PlayerState> = { gameId: id };
    const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

    const playerStatesMap: PlayerStateMap = {};
    for await (const doc of playerStatesCursor) {
      delete (doc as any)["_id"];
      playerStatesMap[doc.playerId] = doc;
    }

    if (Object.keys(playerStatesMap).length === 0) {
      return null;
    }

    return {
      gameState,
      playerStates: playerStatesMap,
    };
  } catch (e) {
    return null;
  }
}
