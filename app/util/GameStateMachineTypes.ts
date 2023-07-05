import { PlayerStateMap } from "../api/models";
import { GameCardType } from "./CardTypes";
import { GameState } from "./GameTypes";
import { PlayerState } from "./PlayerTypes";

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

export interface PlaceCardStep {
  type: "placeCard";
  cardValue: number;
  cardType: GameCardType;
  metadata?: object; // TODO: fill out with info about what modifiers were done
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

export interface TempAgencyModifierChosenAction {
  type: "tempAgencyModifierChosen";
  value: number;
}

export interface ChoseCardAction {
  type: "choseCard";
  cardValue: number;
  cardType: GameCardType;
}

export interface PlacedCardAction {
  type: "placedCard";
}

export type GameStateMachineAction = CancelAction | TempAgencyModifierChosenAction | ChoseCardAction | PlacedCardAction;
