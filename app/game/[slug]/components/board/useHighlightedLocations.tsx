import { House } from "@/app/util/PlayerTypes";
import { useGameStateMachineContext, useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseBIS, placeHouse, submitBISTurn } from "../../GameStateMachineActions";

export interface PendingInfo {
  column: number;
  house: House;
}

interface Buildable {
  highlightedColumns?: Array<Set<number>>;
  pendingHouses?: Array<Array<PendingInfo>>;
  onChosen?: (position: number[]) => void;
}

/**
 * Rendering of the city board interaction is *complicated*
 *
 * Need to be able to highlight clickable locations for various states. We also
 * need to be able to ephemerally remember what the "pending" houses are
 * (ex: user picks a BIS card, and wants to BIS the house they just placed)
 */
export function useHighlightedLocations(viewedPlayerId: string): Buildable | null {
  const { gameState, playerStates, step, playerId } = useGameStateMachineContext();
  const dispatch = useGameStateMachineDispatch();

  if (playerId !== viewedPlayerId) {
    return null;
  }

  const playerState = playerStates[playerId];

  if (step.type === "placeCard") {
    return {
      highlightedColumns: [
        findBuildableColumns(playerState.housesRowOne, step.cardValue),
        findBuildableColumns(playerState.housesRowTwo, step.cardValue),
        findBuildableColumns(playerState.housesRowThree, step.cardValue),
      ],
      onChosen: async (position) => {
        const res = await placeHouse(gameState, playerId, position, step);
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
      highlightedColumns: duplicableHouses,
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
  } else if (step.type === "placeBis") {
    const pendingHouses: Array<Array<PendingInfo>> = [[], [], []];
    pendingHouses[step.position[0]].push({ column: step.position[1], house: step.house });

    const dupeLocation = step.duplicateLocation;
    const row = [playerState.housesRowOne, playerState.housesRowTwo, playerState.housesRowThree][dupeLocation[0]];
    const pendingPosition = dupeLocation[0] === step.position[0] ? step.position[1] : null;
    const locations = findDuplicatesLocations(row, pendingPosition, dupeLocation[1]);

    return {
      highlightedColumns: [
        dupeLocation[0] === 0 ? locations : new Set(),
        dupeLocation[0] === 1 ? locations : new Set(),
        dupeLocation[0] === 2 ? locations : new Set(),
      ],
      pendingHouses,
      onChosen: async (position: number[]) => {
        const bisHouse: House = {
          value: step.duplicateValue,
          modifier: "BIS",
        };
        dispatch(await submitBISTurn(gameState, playerId, step.house, step.position, bisHouse, position));
      },
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

function findDuplicatesLocations(row: Array<House | null>, pendingPosition: number | null, duplicatePosition: number) {
  // we can either place to the left or right of the duplicate position, as long as there is nothing else there already

  const leftAvailable =
    duplicatePosition > 0 && row[duplicatePosition - 1] == null && pendingPosition !== duplicatePosition - 1;
  const rightAvailable =
    duplicatePosition < row.length - 1 &&
    row[duplicatePosition + 1] == null &&
    pendingPosition !== duplicatePosition + 1;

  const set = new Set<number>();
  if (leftAvailable) {
    set.add(duplicatePosition - 1);
  }
  if (rightAvailable) {
    set.add(duplicatePosition + 1);
  }
  return set;
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
