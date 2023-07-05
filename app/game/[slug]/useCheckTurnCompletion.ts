import { GameStateMachine } from "@/app/util/GameStateMachineTypes";
import { useEffect } from "react";

// Once the player has submitted their turn and is waiting for everyone else periodically query the API
export function useCheckTurnCompletion(state: GameStateMachine) {
  useEffect(() => {
    let checkId = -1;
    async function check() {
      if (state.step.type !== "wait") {
        return -1;
      }

      console.log("poll API here");
      checkId = window.setTimeout(check, 5000);
    }

    const id = window.setTimeout(check, 5000);
    return () => {
      clearTimeout(id);
      clearTimeout(checkId);
    };
  }, [state.step]);
}
