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
  cardValue: number;
}

interface FenceStep {
  type: "fence";
}

interface PlaceFenceStep {
  type: "placeFence";
}

interface PlaceCardStepCommon {
  type: "placeCard";
  cardValue: number;
  cardType: Extract<GameCardType, "GARDEN" | "POOL" | "TEMP">;
}

interface PlaceCardStepEstate {
  type: "placeCard";
  cardValue: number;
  cardType: Extract<GameCardType, "ESTATE">;
  sizeIncreased: number;
}

export type PlaceCardStep = PlaceCardStepCommon | PlaceCardStepEstate;

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
  cardValue: number;
}

export interface RealEstateModifierChosenAction {
  type: "estateModifierChosen";
  cardValue: number;
  sizeIncreased: number;
}

export interface ChoseCardAction {
  type: "choseCard";
  cardValue: number;
  cardType: GameCardType;
}

export interface PlacedCardAction {
  type: "placedCard";
}

export type GameStateMachineAction =
  | CancelAction
  | TempAgencyModifierChosenAction
  | RealEstateModifierChosenAction
  | ChoseCardAction
  | PlacedCardAction;
