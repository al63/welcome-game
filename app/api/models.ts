import { GameState } from "../util/GameTypes";
import { House, PlayerState } from "../util/PlayerTypes";

export interface CreateGameAPIRequest {
  players?: string[];
}

export interface CreateGameResponse {
  gameId: string;
  players: string[];
}

export interface PlayerStateMap {
  [playerId: string]: PlayerState;
}

export interface GetGameAPIResponse {
  gameState: GameState;
  playerStates: PlayerStateMap;
}

export interface CreateTurnAPIRequest {
  gameId: string;
  playerId: string;
  turn: number;
  housesRowOne: Array<House | null>;
  housesRowTwo: Array<House | null>;
  housesRowThree: Array<House | null>;
  fencesRowOne: boolean[];
  fencesRowTwo: boolean[];
  fencesRowThree: boolean[];
  permitRefusals: number;
  completedPlans: number[];
}

interface BISAction {
  house: House;
  housePosition: number[];
  bisHouse: House;
  bisPosition: number[];
  type: "bis";
}

interface FenceAction {
  house: House;
  housePosition: number[];
  fence: number;
  fencePosition: number[];
  type: "fence";
}

interface RealEstateAction {
  house: House;
  sizeIncreased: number;
  type: "estate";
}

interface StandardAction {
  house: House;
  houseRow: number;
  type: "standard";
}

interface PermitRefusalAction {
  type: "refusal";
}

interface REAL_FOR_SURE_CreateTurnAPIRequest {
  gameId: string;
  playerId: string;
  turn: number;
  action: StandardAction | FenceAction | BISAction | RealEstateAction | PermitRefusalAction;
}
