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

export type GameStateMachineThunk = (dispatch: React.Dispatch<GameStateMachineAction>) => void;

const GameStateMachineDispatchContext = createContext<
  ((action: GameStateMachineAction | GameStateMachineThunk) => void) | null
>(null);

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
  // initial game state is either 1) choose a card, 2) waiting for other to choose a card (we refreshed), 3) game ended
  // TODO: handle game completion
  const startWaiting = initialPlayerStates[playerId].turn > initialGameState.turn;
  const [state, dispatch] = useReducer(gameStateMachineReducer, {
    playerId,
    gameState: initialGameState,
    playerStates: initialPlayerStates,
    step: {
      type: startWaiting ? "wait" : "choose",
    },
  });

  const dispatchWithThunk = React.useMemo(() => {
    return (action: GameStateMachineAction | ((dispatch: React.Dispatch<GameStateMachineAction>) => void)) => {
      if (typeof action === "function") {
        action(dispatch);
      } else {
        dispatch(action);
      }
    };
  }, [dispatch]);

  return (
    <GameStateMachineContext.Provider value={state}>
      <GameStateMachineDispatchContext.Provider value={dispatchWithThunk}>
        {children}
      </GameStateMachineDispatchContext.Provider>
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
