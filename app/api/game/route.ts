import { GameState } from "@/app/util/GameTypes";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { Filter } from "mongodb";
import { CreateGameAPIRequest } from "../models";
import { generateGameId } from "@/app/util/GameIdGenerator";

// Grab the game state as well as verifying that the provided player is also in this game
// ex: localhost:3000/api/game?id=bubgame&player=liz
export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const id = params.get('id');
        const player = params.get('player');

        if (!id || !player) {
            return NextResponse.json("Missing parameters", { status: 400 })
        }

        const client = await clientPromise;
        const db = client.db("wtypf");
        const gameState = (await db.collection<GameState>("game_states").findOne({id: id} as Filter<GameState>)) as GameState;
        if (!gameState) {
            return NextResponse.json("Game not found", { status: 404 })
        }
        const players = gameState.players
        if (!players || !players.includes(player)) {
            return NextResponse.json("Player not found", { status: 404 })
        }

        return NextResponse.json(gameState);
    } catch (e) {
        return NextResponse.json(e, { status: 500 });
    }
  }

  export async function POST(request: NextRequest) {
    try {
        const req = await request.json() as CreateGameAPIRequest;
        const gameObj: GameState = {
            id: generateGameId(),
            seed: req.seed,
            seedOffset: 0,
            players: req.players,
            plans: req.plans,
            turn: 0,
            active: true
        }
        const client = await clientPromise;
        const db = client.db("wtypf");
        const res = await db.collection("game_states").insertOne(gameObj);
        if (res.acknowledged) {
            return NextResponse.json("Game creation successful, id: " + gameObj.id, { status: 201 })
        } else {
            return NextResponse.json("Failed to create game", { status: 500 })
        }

    } catch (e) {
        return NextResponse.json(e, { status: 500 });
    }
  }