import { GameState, PlayerMetadataMap } from "@/app/util/gameTypes";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { CreateGameAPIRequest, CreateGameResponse } from "../models";
import { generateCityName, generateGameId } from "@/app/api/utils/gameIdGenerator";
import { drawPlans } from "@/app/api/utils/planDeck";
import { PlayerState } from "@/app/util/playerTypes";
import { ActiveCards, drawCards, shuffleWithSeedAndDrawOffset } from "../utils/deck";

// TODO: do stupid checking to make sure we don't have collisions
// MAYBE TODO: clean up game state if player state somehow fails
// TODO: think about what data we're not returning to the client (i.e. seed)

// Create a new game + player states given a list of players
export async function POST(request: NextRequest) {
  try {
    const req = (await request.json()) as CreateGameAPIRequest;
    if (req.players == null) {
      return NextResponse.json("Failed to create game", { status: 500 });
    }
    const gameId = generateGameId();
    const seedDate: number = new Date().getTime();
    const shuffledDeck = shuffleWithSeedAndDrawOffset(seedDate, 1);
    const activeCards: ActiveCards = drawCards(shuffledDeck);
    const playerMap: PlayerMetadataMap = Object.assign(
      {},
      ...req.players.map((id) => ({ [id]: { score: 0, turn: 1 } }))
    );
    const gameObj: GameState = {
      id: gameId,
      seed: seedDate,
      revealedCardValues: activeCards.revealedNumbers,
      revealedCardModifiers: activeCards.revealedModifiers.map((gameCard) => gameCard.backingType),
      players: playerMap,
      plans: drawPlans(),
      turn: 1,
      shuffleOffset: 1,
      completed: false,
      latestEventLog: ["The game has begun -- good luck!"],
      createdAt: new Date(),
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
        cityName: generateCityName(),
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
        lastEvent: "",
        createdAt: new Date(),
        previousPlacements: null,
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
