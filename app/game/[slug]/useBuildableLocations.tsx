import { GameStep } from "@/app/util/GameStateMachineTypes";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { useGameStateMachineDispatch } from "./GameStateMachineContext";
import { chooseBIS, placeHouse } from "./GameStateMachineActions";

export interface PendingInfo {
  column: number;
  house: House;
}

interface Buildable {
  buildableHouses?: Array<Set<number>>;
  pendingHouses?: Array<Array<PendingInfo>>;
  onChosen?: (position: number[]) => void;
}

/**
 * Introspects from the game step and player state which houses / fences are buildable or are pending being built.
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
      onChosen: async (position) => {
        const res = await placeHouse(position, step);
        dispatch(res);
      },
    };
  } else if (step.type === "chooseBis") {
    const duplicableHouses = [
      findDuplicableColumns(playerState.housesRowOne, step.position[0] === 0 ? step.position[1] : null),
      findDuplicableColumns(playerState.housesRowTwo, step.position[0] === 1 ? step.position[1] : null),
      findDuplicableColumns(playerState.housesRowThree, step.position[0] === 2 ? step.position[1] : null),
    ];
    const pendingHouses: Array<Array<PendingInfo>> = [[], [], []];
    pendingHouses[step.position[0]].push({ column: step.position[1], house: step.house });

    return {
      buildableHouses: duplicableHouses,
      onChosen: async (position) => {
        let dupedValue;
        if (position[0] === step.position[0] && position[1] === step.position[1]) {
          // duping pending house
          dupedValue = step.house.value;
        } else {
          dupedValue = [playerState.housesRowOne, playerState.housesRowTwo, playerState.housesRowThree][position[0]][
            position[1]
          ]?.value;
        }

        if (dupedValue == null) {
          throw "Unexpected - couldnt find house to dupe";
        }
        return dispatch(chooseBIS(position, dupedValue, step));
      },
      pendingHouses,
    };
  } else if (step.type === "estate") {
    const pendingHouses: Array<Array<PendingInfo>> = [[], [], []];
    pendingHouses[step.position[0]].push({ column: step.position[1], house: step.house });
    return {
      pendingHouses,
    };
  }

  return null;
}

function findDuplicableColumns(row: Array<House | null>, pendingPosition: number | null): Set<number> {
  // look for any house that has an adjacent empty location
  const set = new Set<number>();
  for (let i = 0; i < row.length; i++) {
    if (row[i] != null || pendingPosition === i) {
      const leftAvailable = i > 0 && row[i - 1] == null && pendingPosition !== i - 1;
      const rightAvailable = i < row.length - 1 && row[i + 1] == null && pendingPosition !== i + 1;
      if (leftAvailable || rightAvailable) {
        set.add(i);
      }
    }
  }

  return set;
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
