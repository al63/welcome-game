import { GameState } from "../util/GameTypes";
import { PlayerState } from "../util/PlayerTypes";

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
