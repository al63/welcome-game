/**
 * Manages the state machine for a user playing a turn:
 *
 * Given the initial game state
 *
 * 1) Decide what card to play
 * 2) Handle modifiers based on the card
 * 		- BIS: what to duplicate -> where to place duplicate
 * 		- TEMP AGENCY: how to modify the value
 *    - REAL ESTATE: what real estate to bump
 * 		- FENCE: to play a fence or not -> where to place fence
 *
 * 3) Handle placing the actual card on the board
 * 4) await other players to finish their turns
 */

import { PlayerStateMap } from "@/app/api/models";
import { GameCardType } from "@/app/util/CardTypes";
import { GameState } from "@/app/util/GameTypes";

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

interface GameStateMachine {
  step: GameStep;
  gameState: GameState;
  playerStates: PlayerStateMap;
}

export function useGameStateMachine(
  initialGameState: GameState,
  initialPlayerStates: PlayerStateMap
): GameStateMachine {
  const step: ChooseCardStep = {
    step: "choose",
    onChosen: (cardValue, modifier) => null,
  };

  return {
    step,
    gameState: initialGameState,
    playerStates: initialPlayerStates,
  };
}
