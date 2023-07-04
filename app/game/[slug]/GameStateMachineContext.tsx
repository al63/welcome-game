/**
 * Manages the state machine for a user playing a turn:
 *
 * Given the initial game state
 *
 * 1) Decide what card to play
 * 2) Handle modifiers based on the card
 * 3) Handle placing the actual card on the board
 * 4) await other players to finish their turns
 */

import { PlayerStateMap } from "@/app/api/models";
import { GameStateMachine, GameStateMachineAction } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import React, { useContext, useReducer } from "react";
import { createContext } from "react";
import { gameStateMachineReducer } from "./GameStateMachineReducer";

const GameStateMachineContext = createContext<GameStateMachine | null>(null);
const GameStateMachineDispatchContext = createContext<React.Dispatch<GameStateMachineAction> | null>(null);

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
  const [state, dispatch] = useReducer(gameStateMachineReducer, {
    playerId,
    gameState: initialGameState,
    playerStates: initialPlayerStates,
    step: {
      type: "choose",
    },
  });

  return (
    <GameStateMachineContext.Provider value={state}>
      <GameStateMachineDispatchContext.Provider value={dispatch}>{children}</GameStateMachineDispatchContext.Provider>
    </GameStateMachineContext.Provider>
  );
}

export function useGameStateMachineContext() {
  const context = useContext(GameStateMachineContext);
  if (context == null) {
    throw "Using game state machine context without provider";
  }

  return context;
}

export function useGameStateMachineDispatch() {
  const context = useContext(GameStateMachineDispatchContext);
  if (context == null) {
    throw "Using game state machine dispatch context without provider";
  }
  return context;
}
