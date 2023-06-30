import { GameState } from "@/app/util/GameTypes";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { Filter } from "mongodb";
import { CreateGameAPIRequest, GetGameAPIResponse, PlayerStateMap } from "../models";
import { generateGameId } from "@/app/api/utils/GameIdGenerator";
import seedrandom from "seedrandom";
import { drawPlans } from "@/app/api/utils/PlanDeck";
import { PlayerState } from "@/app/util/PlayerTypes";

// TODO: add TTL
// TODO: do stupid checking to make sure we don't have collisions
// MAYBE TODO: clean up game state if player state somehow fails
// TODO: think about what data we're not returning to the client (i.e. seed)
// TODO make deck api

// Grab the game state as well as verifying that the provided player is also in this game
// ex: localhost:3000/api/game?id=bubgame&player=liz
// this will grab all of the player boards too :^)
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get("id") ?? undefined;
    const player = params.get("player");
    const query: Filter<GameState> = { id };

    if (!id || !player) {
      return NextResponse.json("Missing parameters", { status: 400 });
    }

    // Grab game state
    const client = await clientPromise;
    const db = client.db("wtypf");
    const gameState = await db.collection<GameState>("game_states").findOne(query);
    if (!gameState) {
      return NextResponse.json("Game not found", { status: 404 });
    }
    const players = gameState.players;
    if (!players || !players.includes(player)) {
      return NextResponse.json("Player not found", { status: 404 });
    }

    // Grab all player states associated with a game
    const playerStates = db.collection<PlayerState>("player_states");
    const playerStateQuery: Filter<PlayerState> = { gameId: id };
    const playerStatesCursor = playerStates.find<PlayerState>(playerStateQuery);

    const playerStatesMap: PlayerStateMap = {};
    for await (const doc of playerStatesCursor) {
      playerStatesMap[doc.playerId] = doc;
    }

    if (Object.keys(playerStatesMap).length === 0) {
      return NextResponse.json("No player states found", { status: 500 });
    }

    const response: GetGameAPIResponse = {
      gameState,
      playerStates: playerStatesMap,
    };

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

// Create a new game + player states given a list of players
export async function POST(request: NextRequest) {
  try {
    const req = (await request.json()) as CreateGameAPIRequest;
    const gameId = generateGameId();
    const gameObj: GameState = {
      id: gameId,
      seed: seedrandom(gameId)(),
      seedOffset: 0,
      players: req.players,
      plans: drawPlans(),
      turn: 0,
      active: true,
    };
    const client = await clientPromise;
    const db = client.db("wtypf");
    const res = await db.collection("game_states").insertOne(gameObj);
    if (!res.acknowledged) {
      return NextResponse.json("Failed to create game", { status: 500 });
    }

    const playersStateList: PlayerState[] = req.players.map((player) => {
      return {
        playerId: player,
        gameId: gameId,
        score: 0,
        housesRowOne: new Array(10).fill(null),
        housesRowTwo: new Array(11).fill(null),
        housesRowThree: new Array(12).fill(null),
        fencesRowOne: new Array(9).fill(null),
        fencesRowTwo: new Array(10).fill(null),
        fencesRowThree: new Array(11).fill(null),
        completedPlans: [false, false, false],
        estateModifiers: new Array(6).fill(0),
        permitRefusals: 0,
      };
    });
    const playerRes = await db.collection("player_states").insertMany(playersStateList);
    if (!playerRes.acknowledged) {
      return NextResponse.json("Failed to create players", { status: 500 });
    }
    // TODO: return slug + names for URL generation
    return NextResponse.json("Successfully created game state and player states", { status: 201 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
