import { GameStateMachine } from "@/app/util/GameStateMachineTypes";
import { useEffect } from "react";

// Once the player has submitted their turn and is waiting for everyone else periodically query the API
export function useCheckTurnCompletion(state: GameStateMachine) {
  useEffect(() => {
    function check() {
      if (state.step.type !== "wait") {
        return -1;
      }

      console.log("poll API here");
      setTimeout(check, 5000);
    }

    const id = setTimeout(check, 5000);
    return () => clearTimeout(id);
  }, [state.step]);
}
