import { GameCardType } from "./CardTypes";

export interface House {
  value: number;
  modifier: GameCardType;
  usedForPlan?: boolean;
  pool?: boolean;
}

export interface PlayerState {
  playerId: string;
  gameId: string;
  score: number;
  housesRowOne: House[];
  housesRowTwo: House[];
  housesRowThree: House[];
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  completedPlans: boolean[];
  estateModifiers: number[];
  permitRefusals: number;
}
