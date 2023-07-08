import React from "react";
import { submitTurn } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { PromptReshuffleStep } from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import { modifierDisplayName } from "./Card";

interface ReshuffleProps {
  gameState: GameState;
  step: PromptReshuffleStep;
  playerId: string;
}
export function ReshuffleOptions({ gameState, step, playerId }: ReshuffleProps) {
  const dispatch = useGameStateMachineDispatch();
  const upcoming = gameState.revealedCardValues.map((card) => modifierDisplayName(card.backingType));

  const onClick = React.useCallback(
    async (reshuffle: boolean) => {
      dispatch(await submitTurn(gameState, playerId, step.pendingAction, reshuffle));
    },
    [dispatch, gameState, playerId, step.pendingAction]
  );

  return (
    <div className="flex flex-col">
      <p className="my-2 italic text-sm">{`Upcoming: ${upcoming.join(", ")}`}</p>
      <div className="flex gap-4">
        <button className="px-8 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={() => onClick(true)}>
          Yes
        </button>
        <button className="px-8 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={() => onClick(false)}>
          No
        </button>
      </div>
    </div>
  );
}
