import React from "react";
import { useGameStateMachineContext } from "./GameStateMachineContext";

export function usePreviousPlacements(viewedPlayerId: string) {
  const { playerStates } = useGameStateMachineContext();

  const previousPlacements = React.useMemo(() => {
    const houses: Array<Set<number>> = [new Set(), new Set(), new Set()];
    const fences: Array<Set<number>> = [new Set(), new Set(), new Set()];

    const prev = playerStates[viewedPlayerId].previousPlacements;
    if (prev?.house) {
      houses[prev.house?.[0]].add(prev.house?.[1]);
    }
    if (prev?.bis) {
      houses[prev.bis?.[0]].add(prev.bis?.[1]);
    }
    if (prev?.fence) {
      fences[prev.fence?.[0]].add(prev.fence?.[1]);
    }

    return { houses, fences };
  }, [playerStates, viewedPlayerId]);

  return previousPlacements;
}
