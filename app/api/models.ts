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

interface T {
  gameId: string;
  playerId: string;
  turn: number;
  housePlayed: House | null;
  houseRow: number | null;
  fencePlaced: number | null;
  fenceRow: number | null;
  completedCityPlan: number | null;
}
