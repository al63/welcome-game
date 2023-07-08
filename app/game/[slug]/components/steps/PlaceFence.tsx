import React from "react";
import { CancelButton } from "./CancelButton";
import { FenceStep } from "@/app/util/gameStateMachineTypes";
import { GameState } from "@/app/util/gameTypes";
import { SkipButton } from "./SkipButton";

interface PlaceFenceProps {
  step: FenceStep;
  gameState: GameState;
  playerId: string;
}

export function PlaceFence({ step, gameState, playerId }: PlaceFenceProps) {
  return (
    <div className="space-x-2">
      <SkipButton step={step} gameState={gameState} playerId={playerId} text="Skip Fence" />
      <CancelButton />
    </div>
  );
}
