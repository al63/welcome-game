import { GameCard, GameCardType } from "@/app/util/CardTypes";
import Game from "./Game";
import { drawPlans } from "@/app/api/utils/PlanDeck";
import { getGameServerAction } from "@/app/api/game/getGame";

const dummy = {
  playerId: "bob",
  gameId: "bub",
  score: 12,
  turn: 10,
  housesRowOne: new Array(10).fill(null),
  housesRowTwo: new Array(11).fill(null),
  housesRowThree: new Array(12).fill(null),
  fencesRowOne: [true, false, false, true, true, false, false, false, true],
  fencesRowTwo: new Array(10).fill(false),
  fencesRowThree: new Array(11).fill(false),
  completedPlans: [0, 0, 0],
  estateModifiers: [1, 0, 2, 3, 4, 4],
  permitRefusals: 2,
};

dummy.housesRowOne[1] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};

dummy.housesRowOne[2] = {
  value: 5,
  modifier: "GARDEN",
  usedForPlan: true,
};
dummy.housesRowOne[3] = {
  value: 6,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowOne[4] = {
  value: 6,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowOne[5] = {
  value: 6,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowOne[6] = {
  value: 6,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[1] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[2] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[3] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[4] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[5] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowTwo[6] = {
  value: 4,
  modifier: "TEMP",
  usedForPlan: true,
};

const dummyStates = {
  [dummy.playerId]: {
    ...dummy,
    cityName: "The Cool Zone",
    completedPlans: [13, 0, 0],
    lastEvent: "",
  },
  bub: {
    ...dummy,
    playerId: "bub",
    cityName: "BubTown, USA",
    lastEvent: "",
  },
  bubbo: {
    ...dummy,
    playerId: "bubbo",
    cityName: "Bubbolubbo",
    lastEvent: "",
  },
  bibby: {
    ...dummy,
    playerId: "bibby",
    cityName: "The Bibcrib",
    lastEvent: "",
  },
};

const dummyRevealedCardValues: GameCard[] = [
  { value: 8, backingType: "FENCE" },
  { value: 3, backingType: "TEMP" },
  { value: 7, backingType: "GARDEN" },
];
const dummyRevealedCardModifiers: GameCardType[] = ["FENCE", "ESTATE", "POOL"];
const dummyGameState = {
  id: "asdf",
  seed: 123,
  seedOffset: 0,
  revealedCardModifiers: dummyRevealedCardModifiers,
  revealedCardValues: dummyRevealedCardValues,
  players: {
    bub: null,
    bob: null,
    bubbo: null,
    bibby: null,
  },
  plans: drawPlans(),
  turn: 1,
  active: true,
};

export default async function GamePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { player: string };
}) {
  const playerId = searchParams?.player;
  let res;

  if (params.slug === "test") {
    res = {
      playerStates: dummyStates,
      gameState: dummyGameState,
    };
  } else if (playerId != null) {
    res = await getGameServerAction(params.slug, playerId);
  }

  if (res == null || playerId == null) {
    return <div>Game / Player combination not found.</div>;
  }

  return <Game initialPlayerStates={res.playerStates} playerId={playerId} initialGameState={res.gameState} />;
}
