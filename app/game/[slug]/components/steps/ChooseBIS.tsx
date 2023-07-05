import React from "react";
import { submitTurn } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { CancelButton } from "./CancelButton";
import { BISStep } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";

interface ChooseBISProps {
  step: BISStep;
  gameState: GameState;
  playerId: string;
}

export function ChooseBIS({ step, gameState, playerId }: ChooseBISProps) {
  const dispatch = useGameStateMachineDispatch();

  const onSkip = React.useCallback(async () => {
    dispatch(
      await submitTurn(gameState, playerId, {
        type: "standard",
        house: step.house,
        housePosition: step.position,
      })
    );
  }, [dispatch, step, gameState, playerId]);

  return (
    <div>
      <button className="px-8 py-2 mr-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={onSkip}>
        Skip BIS
      </button>
      <CancelButton />
    </div>
  );
}
