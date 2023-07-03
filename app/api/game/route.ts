import { GameState, PlayerScores } from "@/app/util/GameTypes";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { Filter } from "mongodb";
import { CreateGameAPIRequest, CreateGameResponse, GetGameAPIResponse, PlayerStateMap } from "../models";
import { generateGameId } from "@/app/api/utils/GameIdGenerator";
import { drawPlans } from "@/app/api/utils/PlanDeck";
import { PlayerState } from "@/app/util/PlayerTypes";
import { ActiveCards, drawCards, shuffleWithSeedAndDrawOffset } from "../utils/Deck";

// TODO: add TTL
// TODO: do stupid checking to make sure we don't have collisions
// MAYBE TODO: clean up game state if player state somehow fails
// TODO: think about what data we're not returning to the client (i.e. seed)
// make action APIs
// make scoring logic
// logic to detect objective completion
// TODO: generate new seed if we havae to shuffle the deck partway thru the game
// move scoring to the game state, server/api will calc

// Grab the game state and all of the player boards provided that the requested player is in this session
// ex: localhost:3000/api/game?id=bubgame&player=liz
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

    // validate requested player exists in the game
    const players = Object.keys(gameState.players);
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
    if (req.players == null) {
      return NextResponse.json("Failed to create game", { status: 500 });
    }
    const gameId = generateGameId();
    const seedDate: number = new Date().getMilliseconds();
    const shuffledDeck = shuffleWithSeedAndDrawOffset(seedDate, 1);
    const activeCards: ActiveCards = drawCards(shuffledDeck);
    const gameObj: GameState = {
      id: gameId,
      seed: seedDate,
      seedOffset: 1,
      revealedCardValues: activeCards.revealedNumbers,
      revealedCardModifiers: activeCards.revealedModifiers.map((gameCard) => gameCard.backingType),
      players: req.players.reduce<PlayerScores>((accum, cur) => {
        accum[cur] = 0;
        return accum;
      }, {}),
      plans: drawPlans(),
      turn: 1,
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
        cityName: generateGameId(),
        score: 0,
        turn: 1,
        housesRowOne: new Array(10).fill(null),
        housesRowTwo: new Array(11).fill(null),
        housesRowThree: new Array(12).fill(null),
        fencesRowOne: new Array(9).fill(null),
        fencesRowTwo: new Array(10).fill(null),
        fencesRowThree: new Array(11).fill(null),
        completedPlans: [0, 0, 0],
        estateModifiers: new Array(6).fill(0),
        permitRefusals: 0,
      };
    });
    const playerRes = await db.collection("player_states").insertMany(playersStateList);
    if (!playerRes.acknowledged) {
      return NextResponse.json("Failed to create players", { status: 500 });
    }
    return NextResponse.json<CreateGameResponse>({ gameId, players: req.players }, { status: 201 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
