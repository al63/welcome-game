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

export interface GetGameActionResponse {
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
  fencePosition: number[];
  type: "fence";
}

export interface EstateAction {
  house: House;
  housePosition: number[];
  sizeIncreased: number;
  type: "estate";
}

export interface StandardAction {
  house: House;
  housePosition: number[];
  type: "standard";
}

export interface PermitRefusalAction {
  type: "refusal";
}

export type TurnAction = StandardAction | FenceAction | BISAction | EstateAction | PermitRefusalAction;

export interface CreateTurnAPIRequest {
  gameId: string;
  playerId: string;
  turn: number;
  action: TurnAction;
}

export interface CreateTurnAPIResponse {
  playerState: PlayerState;
}

export interface PollTurnAPIResponse {
  result: "RESUME" | "WAIT" | "ERROR";
  error?: string;
}
