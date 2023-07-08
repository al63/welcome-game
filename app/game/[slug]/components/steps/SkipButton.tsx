import React from "react";
import { submitTurn } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { BISStep, FenceStep } from "@/app/util/gameStateMachineTypes";
import { GameState } from "@/app/util/gameTypes";

interface ChooseBISProps {
  step: BISStep | FenceStep;
  gameState: GameState;
  playerId: string;
  text: string;
}

export function SkipButton({ step, gameState, playerId, text }: ChooseBISProps) {
  const dispatch = useGameStateMachineDispatch();

  const onSkip = React.useCallback(async () => {
    dispatch(
      await submitTurn(
        gameState,
        playerId,
        {
          type: "standard",
          house: step.house,
          housePosition: step.position,
        },
        undefined
      )
    );
  }, [dispatch, step, gameState, playerId]);

  return (
    <button className="px-8 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={onSkip}>
      {text}
    </button>
  );
}
