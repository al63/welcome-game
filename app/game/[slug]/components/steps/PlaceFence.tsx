import React from "react";
import { submitTurn } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { CancelButton } from "./CancelButton";
import { FenceStep } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import { SkipButton } from "./SkipButton";

interface PlaceFenceProps {
  step: FenceStep;
  gameState: GameState;
  playerId: string;
}

export function PlaceFence({ step, gameState, playerId }: PlaceFenceProps) {
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
    <div className="space-x-2">
      <SkipButton step={step} gameState={gameState} playerId={playerId} text="Skip Fence" />
      <CancelButton />
    </div>
  );
}
