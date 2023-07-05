import { ESTATE_MODIFIERS } from "@/app/util/Scoring";
import { CancelButton } from "./CancelButton";
import { useGameStateMachineContext, useGameStateMachineDispatch } from "../../GameStateMachineContext";
import React from "react";
import { RealEstateStep } from "@/app/util/GameStateMachineTypes";
import { submitEstateTurn } from "../../GameStateMachineActions";

export function RealEstateModifier({ step }: { step: RealEstateStep }) {
  const dispatch = useGameStateMachineDispatch();
  const { gameState, playerStates, playerId } = useGameStateMachineContext();
  const playerState = playerStates[playerId];

  const eligibleSizes = React.useMemo(() => {
    const res: React.ReactNode[] = [];
    playerState.estateModifiers.forEach((modifierIndex, index) => {
      if (modifierIndex < ESTATE_MODIFIERS[index].length - 1) {
        res.push(
          <button
            onClick={async () =>
              dispatch(await submitEstateTurn(gameState, playerId, step.house, step.position, index + 1))
            }
            className="text-2xl px-2 mr-1 rounded-lg bg-violet-400 hover:bg-violet-500 cursor-pointer"
            key={index + 1}
          >
            {index + 1}
          </button>
        );
      }
    });
    return res;
  }, [playerState.estateModifiers, dispatch, gameState, playerId, step.house, step.position]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex mb-2">{eligibleSizes}</div>
      <CancelButton />
    </div>
  );
}
