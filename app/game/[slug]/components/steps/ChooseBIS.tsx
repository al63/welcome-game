import React from "react";
import { CancelButton } from "./CancelButton";
import { BISStep } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import { SkipButton } from "./SkipButton";

interface ChooseBISProps {
  step: BISStep;
  gameState: GameState;
  playerId: string;
}

export function ChooseBIS({ step, gameState, playerId }: ChooseBISProps) {
  return (
    <div className="space-x-2">
      <SkipButton step={step} gameState={gameState} playerId={playerId} text={"Skip BIS"} />
      <CancelButton />
    </div>
  );
}
