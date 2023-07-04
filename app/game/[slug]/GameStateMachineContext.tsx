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
import { ChooseAction, GameStateMachine, GameStateMachineAction } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import React, { useContext, useReducer } from "react";
import { createContext } from "react";

function reduceChooseAction(state: GameStateMachine, action: ChooseAction): GameStateMachine {
  switch (action.cardType) {
    case "POOL":
    case "GARDEN":
      return {
        ...state,
        step: {
          type: "placeCard",
          cardValue: action.cardValue,
          cardType: action.cardType,
        },
      };
    case "BIS":
    case "ESTATE":
    case "TEMP":
    case "FENCE":
      // TODO:
      return {
        ...state,
        step: {
          type: "choose",
        },
      };
  }
}

function reducer(state: GameStateMachine, action: GameStateMachineAction): GameStateMachine {
  switch (action.type) {
    case "cancel": {
      return {
        ...state,
        step: {
          type: "choose",
        },
      };
    }
    case "choose":
      return reduceChooseAction(state, action);
    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(reducer, {
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
