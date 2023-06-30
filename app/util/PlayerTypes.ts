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
  housesRowOne: Array<House | null>;
  housesRowTwo: Array<House | null>;
  housesRowThree: Array<House | null>;
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  completedPlans: boolean[];
  estateModifiers: number[];
  permitRefusals: number;
}
