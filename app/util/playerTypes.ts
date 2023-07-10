import { GameCardType } from "./cardTypes";

export interface PreviousPlacement {
  position: number[];
  modifier: GameCardType | undefined;
}

export interface PreviousPlacements {
  houses: Array<PreviousPlacement>;
  fence?: number[];
}

export interface House {
  value: number;
  modifier?: GameCardType;
  usedForPlan?: boolean;
}

export interface PlayerStates {
  [playerId: string]: PlayerState;
}
export interface PlayerState {
  playerId: string;
  gameId: string;
  cityName: string;
  score: number;
  housesRowOne: Array<House | null>;
  housesRowTwo: Array<House | null>;
  housesRowThree: Array<House | null>;
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  completedPlans: number[];
  estateModifiers: number[];
  permitRefusals: number;
  lastEvent: string;
  createdAt: Date;
  previousPlacements: PreviousPlacements | null;
}
