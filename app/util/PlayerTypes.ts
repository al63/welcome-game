import { GameCardType } from "./CardTypes";

export interface House {
  value: number;
  modifier: GameCardType;
  usedForPlan?: boolean;
}

export interface Players {
  [playerId: string]: PlayerState;
}

export interface PlayerState {
  playerId: string;
  gameId: string;
  score: number;
  turn: number;
  housesRowOne: Array<House | null>;
  housesRowTwo: Array<House | null>;
  housesRowThree: Array<House | null>;
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  completedPlans: number[];
  estateModifiers: number[];
  permitRefusals: number;
}
