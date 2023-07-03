import { GameCard, GameCardType } from "@/app/util/CardTypes";
import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import Game from "./Game";

const dummy = {
  playerId: "bob",
  gameId: "bub",
  score: 12,
  turn: 10,
  housesRowOne: new Array(10).fill(null),
  housesRowTwo: new Array(11).fill(null),
  housesRowThree: new Array(12).fill(null),
  fencesRowOne: new Array(9).fill(false),
  fencesRowTwo: new Array(10).fill(false),
  fencesRowThree: new Array(11).fill(false),
  completedPlans: [0, 0, 0],
  estateModifiers: [1, 0, 2, 3, 4, 4],
  permitRefusals: 2,
};

const dummyRevealedCardValues: GameCard[] = [
  { value: 8, backingType: "FENCE" },
  { value: 3, backingType: "TEMP" },
  { value: 7, backingType: "GARDEN" },
];

const dummyRevealedCardModifiers: GameCardType[] = ["FENCE", "ESTATE", "POOL"];
const dummyCards = {
  revealedCardValues: dummyRevealedCardValues,
  revealedCardModifiers: dummyRevealedCardModifiers,
};

dummy.housesRowOne[1] = {
  value: 4,
  modifier: "GARDEN",
};

dummy.housesRowOne[2] = {
  value: 5,
  modifier: "POOL",
};
dummy.housesRowOne[4] = {
  value: 6,
  modifier: "TEMP",
};
dummy.housesRowOne[5] = {
  value: 6,
  modifier: "BIS",
};

const states = {
  [dummy.playerId]: {
    ...dummy,
  },
  bub: {
    ...dummy,
    playerId: "bub",
  },
  bubbo: {
    ...dummy,
    playerId: "bubbo",
  },
  bibby: {
    ...dummy,
    playerId: "bibby",
  },
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

  return <Game playerStates={states} playerId={player.playerId} cardState={dummyCards} />;
}
