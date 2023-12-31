import { GameStateMachine, GameStateMachineAction } from "@/app/util/gameStateMachineTypes";
import { useEffect } from "react";
import { poll } from "./GameStateMachineActions";
import { GameStateMachineThunk } from "./GameStateMachineContext";

// Once the player has submitted their turn and is waiting for everyone else periodically query the API
export function useCheckTurnCompletion(
  state: GameStateMachine,
  dispatch: (action: GameStateMachineAction | GameStateMachineThunk) => void
) {
  useEffect(() => {
    let checkId = -1;
    async function check() {
      if (state.step.type !== "wait") {
        return -1;
      }

      dispatch(await poll(state.gameState, state.playerId));
      checkId = window.setTimeout(check, 5000);
    }

    const id = window.setTimeout(check, 5000);
    return () => {
      clearTimeout(id);
      clearTimeout(checkId);
    };
  }, [state.step, dispatch, state.playerId, state.gameState]);
}
