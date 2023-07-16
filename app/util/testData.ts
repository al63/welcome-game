import { PlayerStateMap } from "../api/models";
import { drawPlans } from "../api/utils/planDeck";
import { GameCard, GameCardType } from "./cardTypes";
import { GameState } from "./gameTypes";
import { PlayerState } from "./playerTypes";

const dummy: PlayerState = {
  playerId: "bob",
  gameId: "bub",
  score: 12,
  housesRowOne: new Array(10).fill(null),
  housesRowTwo: new Array(11).fill(null),
  housesRowThree: new Array(12).fill(null),
  fencesRowOne: [true, false, false, true, true, false, false, false, true],
  fencesRowTwo: new Array(10).fill(false),
  fencesRowThree: new Array(11).fill(false),
  completedPlans: [0, 0, 0],
  estateModifiers: [1, 2, 3, 4, 4, 4],
  permitRefusals: 2,
  createdAt: new Date(),
  cityName: "city",
  lastEvent: "event",
  previousPlacements: null,
};

export function fakePlayerState(overrides: Partial<PlayerState>) {
  return {
    ...dummy,
    ...overrides,
  };
}

export const dummyPlayerStates: PlayerStateMap = {
  bob: fakePlayerState({
    cityName: "The Cool Zone",
    lastEvent: "",
  }),
  bub: fakePlayerState({
    playerId: "bub",
    cityName: "BubTown, USA",
    lastEvent: "",
  }),
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
  shuffleOffset: 1,
  latestEventLog: [],
  createdAt: new Date(),
};

export function fakeGameState(overrides: Partial<GameState>) {
  return {
    ...dummyGameState,
    ...overrides,
  };
}
