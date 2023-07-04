import { GameCard, GameCardType } from "@/app/util/CardTypes";
import Game from "./Game";
import { drawPlans } from "@/app/api/utils/PlanDeck";

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
  modifier: "GARDEN",
  usedForPlan: true,
};

dummy.housesRowOne[2] = {
  value: 5,
  modifier: "POOL",
  usedForPlan: true,
};
dummy.housesRowOne[3] = {
  value: 6,
  modifier: "TEMP",
  usedForPlan: true,
};
dummy.housesRowOne[5] = {
  value: 6,
  modifier: "BIS",
};

const states = {
  [dummy.playerId]: {
    ...dummy,
    cityName: "The Cool Zone",
  },
  bub: {
    ...dummy,
    playerId: "bub",
    cityName: "BubTown, USA",
  },
  bubbo: {
    ...dummy,
    playerId: "bubbo",
    cityName: "Bubbolubbo",
  },
  bibby: {
    ...dummy,
    playerId: "bibby",
    cityName: "The Bibcrib",
  },
};

const dummyRevealedCardValues: GameCard[] = [
  { value: 8, backingType: "FENCE" },
  { value: 3, backingType: "TEMP" },
  { value: 7, backingType: "GARDEN" },
];
const dummyRevealedCardModifiers: GameCardType[] = ["FENCE", "ESTATE", "POOL"];
const gameState = {
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

export default function GamePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { player: string };
}) {
  const player = states[searchParams.player];
  if (player == null) {
    return <div>Game / Player combination not found.</div>;
  }

  return <Game playerStates={states} playerId={player.playerId} gameState={gameState} />;
}
