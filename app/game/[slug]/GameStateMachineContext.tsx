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
import { GameStateMachine } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import React, { useContext } from "react";
import { createContext } from "react";

const GameStateMachineContext = createContext<GameStateMachine | null>(null);

interface GameStateMachineProviderProps {
  playerId: string;
  initialGameState: GameState;
  initialPlayerStates: PlayerStateMap;
  children: React.ReactNode;
}

export function GameStateMachineProvider({
  playerId,
  initialGameState,
  initialPlayerStates,
  children,
}: GameStateMachineProviderProps) {
  const onUpdate = React.useCallback(() => {
    return null;
  }, []);

  const [stateMachine, setStateMachine] = React.useState<GameStateMachine>({
    playerId,
    step: {
      step: "choose",
      onChosen: (cardValue, modifier) => onUpdate(),
    },
    gameState: initialGameState,
    playerStates: initialPlayerStates,
  });

  return <GameStateMachineContext.Provider value={stateMachine}>{children}</GameStateMachineContext.Provider>;
}

export function useGameStateMachineContext(): GameStateMachine {
  const context = useContext(GameStateMachineContext);
  if (context == null) {
    throw "Using game state machine context without provider";
  }

  return context;
}
