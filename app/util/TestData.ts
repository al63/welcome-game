import { drawPlans } from "../api/utils/PlanDeck";
import { GameCard, GameCardType } from "./CardTypes";
import { GameState } from "./GameTypes";

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
  modifier: "PARK",
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
};
dummy.housesRowOne[6] = {
  value: 6,
  modifier: "TEMP",
};
dummy.housesRowTwo[1] = {
  value: 2,
  modifier: "TEMP",
};
dummy.housesRowTwo[2] = {
  value: 3,
  modifier: "TEMP",
};
dummy.housesRowTwo[3] = {
  value: 4,
  modifier: "TEMP",
};
dummy.housesRowTwo[4] = {
  value: 5,
  modifier: "TEMP",
};
dummy.housesRowTwo[5] = {
  value: 5,
  modifier: "TEMP",
};
dummy.housesRowTwo[6] = {
  value: 8,
  modifier: "TEMP",
};

export const dummyPlayerStates = {
  [dummy.playerId]: {
    ...dummy,
    cityName: "The Cool Zone",
    completedPlans: [6, 0, 13],
    lastEvent: "",
  },
  bub: {
    ...dummy,
    playerId: "bub",
    cityName: "BubTown, USA",
    completedPlans: [8, 10, 0],
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
  { value: 5, backingType: "TEMP" },
  { value: 7, backingType: "PARK" },
];
const dummyRevealedCardModifiers: GameCardType[] = ["ESTATE", "FENCE", "BIS"];

export const dummyGameState: GameState = {
  id: "asdf",
  seed: 123,
  revealedCardModifiers: dummyRevealedCardModifiers,
  revealedCardValues: dummyRevealedCardValues,
  players: {
    bub: { score: 0, turn: 1 },
    bob: { score: 0, turn: 1 },
    bubbo: { score: 0, turn: 1 },
    bibby: { score: 0, turn: 1 },
  },
  plans: drawPlans(),
  turn: 1,
  completed: false,
  latestEventLog: [],
};
