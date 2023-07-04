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

export interface BISAction {
  house: House;
  housePosition: number[];
  bisHouse: House;
  bisPosition: number[];
  type: "bis";
}

export interface FenceAction {
  house: House;
  housePosition: number[];
  fence: number;
  fencePosition: number[];
  type: "fence";
}

export interface EstateAction {
  house: House;
  sizeIncreased: number;
  type: "estate";
}

export interface StandardAction {
  house: House;
  houseRow: number;
  type: "standard";
}

export interface PermitRefusalAction {
  type: "refusal";
}

export interface CreateTurnAPIRequest {
  gameId: string;
  playerId: string;
  turn: number;
  action: StandardAction | FenceAction | BISAction | EstateAction | PermitRefusalAction;
}
