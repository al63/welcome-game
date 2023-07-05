import { GameStep } from "@/app/util/GameStateMachineTypes";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { useGameStateMachineDispatch } from "./GameStateMachineContext";
import { placeHouse } from "./GameStateMachineActions";

interface Buildable {
  buildableHouses?: Array<Set<number>>;
  pendingHouses?: Array<Set<number>>;
  onBuild?: (position: number[]) => void;
}

/**
 * Introspects from the game step and player state which houses / fences are buildable.
 */
export function useBuildableLocations(step: GameStep, playerState: PlayerState, playerId: string): Buildable | null {
  const dispatch = useGameStateMachineDispatch();
  if (playerState.playerId !== playerId) {
    return null;
  }

  if (step.type === "placeCard") {
    return {
      buildableHouses: [
        findBuildableColumns(playerState.housesRowOne, step.cardValue),
        findBuildableColumns(playerState.housesRowTwo, step.cardValue),
        findBuildableColumns(playerState.housesRowThree, step.cardValue),
      ],
      onBuild: async (position) => {
        const res = await placeHouse(position, step);
        dispatch(res);
      },
    };
  } else if (step.type === "estate") {
    const pendingHouses = [new Set<number>(), new Set<number>(), new Set<number>()];
    pendingHouses[step.position[0]].add(step.position[1]);
    return {
      pendingHouses,
    };
  }

  return null;
}

function findBuildableColumns(row: Array<House | null>, value: number): Set<number> {
  const output = new Set<number>();
  let lowIdx = -1;
  let lowValue = -1;

  function fillOutput(low: number, high: number) {
    for (let i = low; i < high; i++) {
      output.add(i);
    }
  }

  for (let i = 0; i < row.length; i++) {
    const house = row[i];
    if (house !== null) {
      const highValue = house.value;

      if (value > lowValue && value < highValue) {
        fillOutput(lowIdx + 1, i);
      }

      lowIdx = i;
      lowValue = house.value;
    }
  }

  if (value > lowValue && value < 18) {
    fillOutput(lowIdx + 1, row.length);
  }

  return output;
}
