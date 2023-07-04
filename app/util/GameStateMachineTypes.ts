import { PlayerStateMap } from "../api/models";
import { GameCardType } from "./CardTypes";
import { GameState } from "./GameTypes";

interface ChooseCardStep {
  step: "choose";
  onChosen: (cardValue: number, modifier: GameCardType) => void;
}

interface BISStep {
  step: "chooseBis";
  onChosen: (cardValue: number, location: number[]) => void;
}

interface PlaceBISStep {
  step: "placeBis";
  duplicatedCardLocation: number[];
  onChosen: (cardValue: number, location: number[]) => void;
}

interface TempAgencyStep {
  step: "temp";
  cardValue: number;
  onChosen: (newValue: number) => void;
}

interface RealEstateStep {
  step: "estate";
  onChosen: (sizeIncreased: number) => void;
}

interface FenceStep {
  step: "fence";
  onChosen: (willPlaceFence: boolean) => void;
}

interface PlaceFenceStep {
  step: "placeFence";
  onChosen: (fenceLocation: number[]) => void;
}

interface PlaceCardStep {
  step: "placeCard";
  cardValue: number;
  cardModifier: GameCardType;
  onChosen: (location: number[]) => void;
}

interface WaitStep {
  step: "wait";
}

type GameStep =
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
