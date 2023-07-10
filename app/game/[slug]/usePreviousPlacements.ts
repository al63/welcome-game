import React from "react";
import { useGameStateMachineContext } from "./GameStateMachineContext";
import { GameCardType } from "@/app/util/cardTypes";

export interface PreviousPlacementColumn {
  column: number;
  modifier: GameCardType | undefined;
}

export function usePreviousPlacements(viewedPlayerId: string) {
  const { playerStates } = useGameStateMachineContext();

  const previousPlacements = React.useMemo(() => {
    const houses: Array<Array<PreviousPlacementColumn>> = [[], [], []];
    const fences: Array<Set<number>> = [new Set(), new Set(), new Set()];

    const prev = playerStates[viewedPlayerId].previousPlacements;
    if (prev?.houses) {
      prev.houses.forEach((house) => {
        houses[house.position[0]].push({
          column: house.position[1],
          modifier: house.modifier,
        });
      });
    }

    if (prev?.fence) {
      fences[prev.fence?.[0]].add(prev.fence?.[1]);
    }

    return { houses, fences };
  }, [playerStates, viewedPlayerId]);

  return previousPlacements;
}
