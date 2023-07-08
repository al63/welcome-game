import { House } from "@/app/util/PlayerTypes";
import { useGameStateMachineContext, useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseBIS, placeHouse, submitBISTurn, submitFenceTurn } from "../../GameStateMachineActions";

export interface PendingInfo {
  column: number;
  house: House;
}

interface Buildable {
  highlightedColumns?: Array<Set<number>>;
  highlightedFences?: Array<Set<number>>;
  pendingHouses?: Array<Array<PendingInfo>>;
  onColumnChosen?: (position: number[]) => void;
  onFenceChosen?: (position: number[]) => void;
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
      onColumnChosen: async (position) => {
        const res = await placeHouse(gameState, playerState, position, step);
        dispatch(res);
      },
    };
  } else if (step.type === "chooseBis") {
    const duplicableHouses = [
      findDuplicableColumns(
        playerState.housesRowOne,
        playerState.fencesRowOne,
        step.position[0] === 0 ? step.position[1] : null
      ),
      findDuplicableColumns(
        playerState.housesRowTwo,
        playerState.fencesRowTwo,
        step.position[0] === 1 ? step.position[1] : null
      ),
      findDuplicableColumns(
        playerState.housesRowThree,
        playerState.fencesRowThree,
        step.position[0] === 2 ? step.position[1] : null
      ),
    ];
    const pendingHouses: Array<Array<PendingInfo>> = [[], [], []];
    pendingHouses[step.position[0]].push({ column: step.position[1], house: step.house });

    return {
      highlightedColumns: duplicableHouses,
      onColumnChosen: async (position) => {
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
    const fences = [playerState.fencesRowOne, playerState.fencesRowTwo, playerState.fencesRowThree][dupeLocation[0]];
    const pendingPosition = dupeLocation[0] === step.position[0] ? step.position[1] : null;
    const locations = findDuplicatesLocations(row, fences, pendingPosition, dupeLocation[1]);

    return {
      highlightedColumns: [
        dupeLocation[0] === 0 ? locations : new Set(),
        dupeLocation[0] === 1 ? locations : new Set(),
        dupeLocation[0] === 2 ? locations : new Set(),
      ],
      pendingHouses,
      onColumnChosen: async (position: number[]) => {
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
  } else if (step.type === "fence") {
    const pendingHouses: Array<Array<PendingInfo>> = [[], [], []];
    pendingHouses[step.position[0]].push({ column: step.position[1], house: step.house });
    return {
      highlightedFences: [
        findBuildableFences(playerState.fencesRowOne, playerState.housesRowOne),
        findBuildableFences(playerState.fencesRowTwo, playerState.housesRowTwo),
        findBuildableFences(playerState.fencesRowThree, playerState.housesRowThree),
      ],
      pendingHouses,
      onFenceChosen: async (position: number[]) =>
        dispatch(await submitFenceTurn(gameState, playerId, step.house, step.position, position)),
    };
  }

  return null;
}

function findBuildableFences(fences: boolean[], houses: Array<House | null>) {
  // house of index i is right before fence of index i: house[0] fence[0] house[1] fence[1] house[2]
  // there is an implied ending fence and implied starting fence, so fence length is 1 less
  if (fences.length + 1 !== houses.length) {
    throw "unexpected fence / house length combination";
  }

  // A fence is placeable at index i if:
  // 1) fences[i] === false
  // 2) this doesn't cut through a completed plan: houses[i].usedForPlan === false is good enough
  // 3) this doesn't separate a house from it's BIS
  const set = new Set<number>();
  for (let i = 0; i < fences.length; i++) {
    const fencePlaced = !!fences[i];
    const splitsPlan = !!houses[i]?.usedForPlan;
    const splitsBIS = houses[i] != null && houses[i + 1] != null && houses[i]?.value === houses[i + 1]?.value;
    if (!fencePlaced && !splitsPlan && !splitsBIS) {
      set.add(i);
    }
  }

  return set;
}

function findDuplicatesLocations(
  row: Array<House | null>,
  fences: boolean[],
  pendingPosition: number | null,
  duplicatePosition: number
) {
  // we can either place to the left or right of the duplicate position if:
  //  1) the house is empty
  //  2) no fence is in the way

  if (fences.length + 1 !== row.length) {
    throw "unexpected fence / house length combination";
  }

  const leftAvailable =
    duplicatePosition > 0 &&
    row[duplicatePosition - 1] == null &&
    pendingPosition !== duplicatePosition - 1 &&
    !fences[duplicatePosition - 1];

  const rightAvailable =
    duplicatePosition < row.length - 1 &&
    row[duplicatePosition + 1] == null &&
    pendingPosition !== duplicatePosition + 1 &&
    !fences[duplicatePosition];

  const set = new Set<number>();
  if (leftAvailable) {
    set.add(duplicatePosition - 1);
  }
  if (rightAvailable) {
    set.add(duplicatePosition + 1);
  }
  return set;
}

function findDuplicableColumns(
  row: Array<House | null>,
  fences: boolean[],
  pendingPosition: number | null
): Set<number> {
  // For the BIS action, we can duplicate any house if:
  //  1) There is an adjacent empty space.
  //  2) Said adjacent empty space isn't cut off by a fence

  if (fences.length + 1 !== row.length) {
    throw "unexpected fence / house length combination";
  }

  const set = new Set<number>();
  for (let i = 0; i < row.length; i++) {
    if (row[i] != null || pendingPosition === i) {
      const leftAvailable = i > 0 && row[i - 1] == null && pendingPosition !== i - 1 && !fences[i - 1];
      const rightAvailable = i < row.length - 1 && row[i + 1] == null && pendingPosition !== i + 1 && !fences[i];
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
