import { PlayerStateMap } from "../api/models";
import { GameCardType } from "./CardTypes";
import { GameState } from "./GameTypes";
import { House, PlayerState } from "./PlayerTypes";

interface ChooseCardStep {
  type: "choose";
}

interface TempAgencyStep {
  type: "temp";
  cardValue: number;
}

export interface PlaceCardStep {
  type: "placeCard";
  cardValue: number;
  cardType: GameCardType;
  followUp?: "BIS" | "ESTATE" | "FENCE";
}

interface WaitStep {
  type: "wait";
}

interface ErrorStep {
  type: "error";
}

export interface RealEstateStep {
  type: "estate";
  position: number[];
  house: House;
}

export interface BISStep {
  type: "chooseBis";
  position: number[];
  house: House;
}

interface PlaceBISStep {
  type: "placeBis";
  position: number[];
  house: House;
  duplicateValue: number;
  duplicateLocation: number[];
}

export interface FenceStep {
  type: "fence";
  position: number[];
  house: House;
}

export type GameStep =
  | ChooseCardStep
  | BISStep
  | PlaceBISStep
  | TempAgencyStep
  | RealEstateStep
  | FenceStep
  | PlaceCardStep
  | WaitStep
  | ErrorStep;

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

export interface ChoseBISAction {
  type: "choseBis";
  position: number[];
  house: House;
  duplicatePosition: number[];
  duplicateValue: number;
}

export interface ChoseCardAction {
  type: "choseCard";
  cardValue: number;
  cardType: GameCardType;
}

export interface PlacedCardAction {
  type: "placedCard";
  followUp: "BIS" | "ESTATE" | "FENCE";
  position: number[];
  house: House;
}

export interface SubmitStartAction {
  type: "submitting";
}

export interface SubmitCompleteAction {
  type: "submitted";
  playerState: PlayerState;
}

export interface ErrorAction {
  type: "error";
}

export type GameStateMachineAction =
  | CancelAction
  | TempAgencyModifierChosenAction
  | ChoseCardAction
  | PlacedCardAction
  | ChoseBISAction
  | SubmitStartAction
  | SubmitCompleteAction
  | ErrorAction;
