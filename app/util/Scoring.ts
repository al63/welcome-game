import { GameCardType } from "./CardTypes";
import { ROW_ONE, ROW_THREE, ROW_TWO } from "./Neighborhoods";
import { House, PlayerState, PlayerStates } from "./PlayerTypes";

export const POOL_SCORES = [0, 3, 6, 9, 13, 17, 21, 26, 31, 36];
export const TEMP_SCORES = [7, 4, 1];
export const ESTATE_MODIFIERS = [
  [1, 3],
  [2, 3, 4],
  [3, 4, 5, 6],
  [4, 5, 6, 7, 8],
  [5, 6, 7, 8, 10],
  [6, 7, 8, 10, 12],
];
export const BIS_SCORES = [0, 1, 3, 6, 9, 12, 16, 20, 24, 28];
export const PERMIT_REFUSAL_SCORES = [0, 0, 3, 5];

export interface EstatesScore {
  count: number;
  value: number;
}

interface UserScore {
  plans: number;
  parks: number[];
  pools: {
    count: number;
    score: number;
  };
  tempAgencies: {
    count: number;
    score: number;
  };
  estates: Array<EstatesScore>;
  bis: {
    count: number;
    score: number;
  };
  permitRefusals: number;
  summation: number;
}

function countType(row: Array<House | null>, type: GameCardType) {
  return row.reduce((accum, cur) => {
    return accum + (cur?.modifier === type ? 1 : 0);
  }, 0);
}

export function computeScore(playerId: string, playerStates: PlayerStates): UserScore | null {
  const playerState = playerStates[playerId];
  if (!playerState) {
    return null;
  }

  const plansScores = playerState.completedPlans.reduce((accum, cur) => accum + cur, 0);

  const houseRows = [playerState.housesRowOne, playerState.housesRowTwo, playerState.housesRowThree];

  const parks = houseRows.map((row) => countType(row, "GARDEN"));
  const parkScores = [ROW_ONE.parkScores[parks[0]], ROW_TWO.parkScores[parks[1]], ROW_THREE.parkScores[parks[2]]];

  const pools = houseRows.reduce((accum, cur) => accum + countType(cur, "POOL"), 0);
  const poolsScore = POOL_SCORES[pools];

  // pain ahead: have to compute the count of temp agencies for each player, and determine what our place is accounting for ties
  const playerStatesArray = Object.values(playerStates);
  const tempAgenciesByPlayer = playerStatesArray
    .map((state) => {
      const rows = [state.housesRowOne, state.housesRowTwo, state.housesRowThree];
      const tempAgencies = rows.reduce((accum, cur) => accum + countType(cur, "TEMP"), 0);
      return {
        playerId: state.playerId,
        tempAgencies,
      };
    })
    .filter((x) => x.tempAgencies > 0);

  tempAgenciesByPlayer.sort((x, y) => {
    return x.tempAgencies - y.tempAgencies;
  });

  let place = -1;
  let tempAgenciesCount = 0;
  let prevScore = -1;
  for (let i = 0; i < tempAgenciesByPlayer.length; i++) {
    if (tempAgenciesByPlayer[i].tempAgencies > prevScore) {
      place++;
      prevScore = tempAgenciesByPlayer[i].tempAgencies;
    }

    if (tempAgenciesByPlayer[i].playerId === playerId) {
      tempAgenciesCount = tempAgenciesByPlayer[i].tempAgencies;
      break;
    }
  }
  const tempAgenciesScore = TEMP_SCORES[place] ?? 0;

  const estatesScore = calculateEstatesScore(playerState);
  const estatesScoreSum = estatesScore.reduce((accum, cur) => {
    return accum + cur.value;
  }, 0);

  const bis = houseRows.reduce((accum, cur) => accum + countType(cur, "BIS"), 0);
  const bisScore = BIS_SCORES[bis] ?? 0;

  const permitRefusalsScore = PERMIT_REFUSAL_SCORES[playerState.permitRefusals];

  const summation =
    plansScores +
    parkScores[0] +
    parkScores[1] +
    parkScores[2] +
    poolsScore +
    tempAgenciesScore +
    estatesScoreSum -
    bisScore -
    permitRefusalsScore;

  return {
    plans: plansScores,
    parks: parkScores,
    pools: {
      count: pools,
      score: poolsScore,
    },
    tempAgencies: {
      count: tempAgenciesCount,
      score: tempAgenciesScore,
    },
    estates: estatesScore,
    bis: {
      count: bis,
      score: bisScore,
    },
    permitRefusals: permitRefusalsScore,
    summation,
  };
}

function calculateEstatesScore(playerState: PlayerState): Array<EstatesScore> {
  const one = getEstatesResult(playerState.fencesRowOne, playerState.housesRowOne);
  const two = getEstatesResult(playerState.fencesRowTwo, playerState.housesRowTwo);
  const three = getEstatesResult(playerState.fencesRowThree, playerState.housesRowThree);
  return playerState.estateModifiers.map((modifierIndex, index) => {
    const modifierValue = ESTATE_MODIFIERS[index][modifierIndex];
    const count = one[index].length + two[index].length + three[index].length;
    return {
      count,
      value: count * modifierValue,
    };
  });
}

// we need to check if all houses between two fences are built
// check fence arrays, for fence = true, check all houses to the next fence = true
// the edges of each street have fences by default, but aren't represented in the array
// the return value will be an array of estate sizes containing an array of arrays representing the start and end index of the estate
export function getEstatesResult(fenceRow: boolean[], houseRow: Array<House | null>): number[][][] {
  const estateResult: number[][][] = [[], [], [], [], [], []];

  let firstFenceIdx = -1;
  let lastFenceIdx = -1;
  for (let i = 0; i < fenceRow.length + 1; i++) {
    lastFenceIdx++;

    if (firstFenceIdx == -1 && lastFenceIdx == 0) {
      if (checkValidEstate(houseRow, 0, 0)) {
        estateResult[0].push([0, 0]);
      }
    } else if (firstFenceIdx == fenceRow.length - 1) {
      if (checkValidEstate(houseRow, houseRow.length - 1, houseRow.length - 1)) {
        estateResult[0].push([houseRow.length - 1, houseRow.length - 1]);
      }
    } else if (fenceRow[i]) {
      if (checkValidEstate(houseRow, firstFenceIdx + 1, lastFenceIdx)) {
        estateResult[lastFenceIdx - firstFenceIdx - 1].push([firstFenceIdx + 1, lastFenceIdx]);
      }
    } else {
      continue;
    }
    firstFenceIdx = lastFenceIdx;
  }

  return estateResult;
}

function checkValidEstate<T>(row: T[], start: number, end: number): boolean {
  for (let i = start; i <= end; i++) {
    if (row[i] == null) {
      return false;
    }
  }

  if (end - start + 1 > 6) {
    return false;
  }

  return true;
}
