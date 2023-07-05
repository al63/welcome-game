import { GameStateMachine, GameStateMachineAction } from "@/app/util/GameStateMachineTypes";
import { useEffect } from "react";
import { poll } from "./GameStateMachineActions";

// Once the player has submitted their turn and is waiting for everyone else periodically query the API
export function useCheckTurnCompletion(
  state: GameStateMachine,
  dispatch: (action: GameStateMachineAction | ((dispatch: React.Dispatch<GameStateMachineAction>) => void)) => void
) {
  useEffect(() => {
    let checkId = -1;
    async function check() {
      if (state.step.type !== "wait") {
        return -1;
      }

      console.log("poll API here");
      dispatch(poll(state.gameState.id, state.gameState.turn + 1));
      checkId = window.setTimeout(check, 5000);
    }

    const id = window.setTimeout(check, 5000);
    return () => {
      clearTimeout(id);
      clearTimeout(checkId);
    };
  }, [state.step]);
}
