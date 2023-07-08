import { findBuildableColumns } from "@/app/util/findBuildableColumns";
import { useGameStateMachineContext } from "./GameStateMachineContext";
import { GameCard } from "@/app/util/CardTypes";
import React from "react";

export function useHasValidMoves(revealedCards: GameCard[]) {
  const { playerStates, playerId } = useGameStateMachineContext();
  const playerState = playerStates[playerId];
  const hasMoves = React.useMemo(() => {
    return revealedCards
      .map((card) => {
        const r1 = findBuildableColumns(playerState.housesRowOne, card.value);
        const r2 = findBuildableColumns(playerState.housesRowTwo, card.value);
        const r3 = findBuildableColumns(playerState.housesRowThree, card.value);

        return r1.size > 0 || r2.size > 0 || r3.size > 0;
      })
      .reduce((accum, cur) => {
        return accum || cur;
      }, false);
  }, [playerState.housesRowOne, playerState.housesRowThree, playerState.housesRowTwo, revealedCards]);

  return hasMoves;
}
