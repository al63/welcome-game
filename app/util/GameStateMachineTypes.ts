import { PlayerStateMap } from "../api/models";
import { GameCardType } from "./CardTypes";
import { GameState } from "./GameTypes";

interface ChooseCardStep {
  type: "choose";
}

interface BISStep {
  type: "chooseBis";
}

interface PlaceBISStep {
  type: "placeBis";
  duplicatedCardLocation: number[];
}

interface TempAgencyStep {
  type: "temp";
  cardValue: number;
}

interface RealEstateStep {
  type: "estate";
}

interface FenceStep {
  type: "fence";
}

interface PlaceFenceStep {
  type: "placeFence";
}

interface PlaceCardStep {
  type: "placeCard";
  cardValue: number;
  cardType: GameCardType;
}

interface WaitStep {
  type: "wait";
}

export type GameStep =
  | ChooseCardStep
  | BISStep
  | PlaceBISStep
  | TempAgencyStep
  | RealEstateStep
  | FenceStep
  | PlaceFenceStep
  | PlaceCardStep
  | WaitStep;

export interface GameStateMachine {
  playerId: string;
  step: GameStep;
  gameState: GameState;
  playerStates: PlayerStateMap;
}

export interface CancelAction {
  type: "cancel";
}

export interface ChooseAction {
  type: "choose";
  cardValue: number;
  cardType: GameCardType;
}

export type GameStateMachineAction = CancelAction | ChooseAction;
