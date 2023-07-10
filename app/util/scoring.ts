import { GameCardType } from "./cardTypes";
import { ROW_ONE, ROW_THREE, ROW_TWO } from "./neighborhoods";
import { House, PlayerState, PlayerStates } from "./playerTypes";

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
  pools: number;
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

  const parks = houseRows.map((row) => countType(row, "PARK"));
  // possible to have more parks than the score system accounts for
  const parkScores = [
    ROW_ONE.parkScores[parks[0]] ?? ROW_ONE.parkScores[ROW_ONE.parkScores.length - 1],
    ROW_TWO.parkScores[parks[1]] ?? ROW_TWO.parkScores[ROW_TWO.parkScores.length - 1],
    ROW_THREE.parkScores[parks[2] ?? ROW_THREE.parkScores[ROW_THREE.parkScores.length - 1]],
  ];

  const pools = houseRows.reduce((accum, cur) => accum + countType(cur, "POOL"), 0);
  const poolsScore = POOL_SCORES[pools] ?? POOL_SCORES[POOL_SCORES.length - 1];

  // pain ahead: have to compute the count of temp agencies for each player, and determine what our place is accounting for ties
  const playerStatesArray = Object.values(playerStates);
  const tempAgenciesByPlayer = playerStatesArray
    .map((state) => {
      const rows = [state.housesRowOne, state.housesRowTwo, state.housesRowThree];
      const tempAgencies = Math.min(
        rows.reduce((accum, cur) => accum + countType(cur, "TEMP"), 0),
        11
      );
      return {
        playerId: state.playerId,
        tempAgencies,
      };
    })
    .filter((x) => x.tempAgencies > 0);

  tempAgenciesByPlayer.sort((x, y) => {
    return y.tempAgencies - x.tempAgencies;
  });

  let place = -1;
  let tempAgenciesCount = 0;
  let prevScore = Infinity;
  for (let i = 0; i < tempAgenciesByPlayer.length; i++) {
    if (tempAgenciesByPlayer[i].tempAgencies < prevScore) {
      place++;
      prevScore = tempAgenciesByPlayer[i].tempAgencies;
    }

    if (tempAgenciesByPlayer[i].playerId === playerId) {
      tempAgenciesCount = tempAgenciesByPlayer[i].tempAgencies;
      break;
    }
  }
  const tempAgenciesScore = tempAgenciesCount > 0 ? TEMP_SCORES[place] ?? 0 : 0;

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
    pools: poolsScore,
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

export function calculateEstatesScore(playerState: PlayerState): Array<EstatesScore> {
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
// the return value will be an array of estate size to an array of arrays representing the start and end index of the estate
// example
// [[[0,0],[1,1],[2,2]]], [[],[[0,1],[2,3],[4,5]]]
// [0][0] returns an array of estates of size 1
// [1][0] returns an array of estates of size 2
// [0][0][0] returns the first house position of an estate of size 1

interface EstatesResult {
  columns: number[];
  usedForPlan: boolean;
}
export function getEstatesResult(fenceRow: boolean[], houseRow: Array<House | null>): EstatesResult[][] {
  const estateResult: EstatesResult[][] = [[], [], [], [], [], []];

  let firstFenceIdx = -1;
  let lastFenceIdx = -1;
  for (let i = 0; i < fenceRow.length + 1; i++) {
    lastFenceIdx++;

    if (firstFenceIdx == -1 && lastFenceIdx == 0 && fenceRow[lastFenceIdx]) {
      const res = checkValidEstate(houseRow, 0, 0);
      if (res.isValid) {
        estateResult[0].push({
          columns: [0, 0],
          usedForPlan: res.usedInPlan,
        });
      }
    } else if (firstFenceIdx == fenceRow.length - 1 && fenceRow[firstFenceIdx]) {
      const res = checkValidEstate(houseRow, houseRow.length - 1, houseRow.length - 1);
      if (res.isValid) {
        estateResult[0].push({
          columns: [houseRow.length - 1, houseRow.length - 1],
          usedForPlan: res.usedInPlan,
        });
      }
    } else if (lastFenceIdx == fenceRow.length) {
      const res = checkValidEstate(houseRow, firstFenceIdx + 1, houseRow.length - 1);
      if (res.isValid) {
        estateResult[lastFenceIdx - firstFenceIdx - 1].push({
          columns: [firstFenceIdx + 1, houseRow.length - 1],
          usedForPlan: res.usedInPlan,
        });
      }
    } else if (fenceRow[i]) {
      const res = checkValidEstate(houseRow, firstFenceIdx + 1, lastFenceIdx);
      if (res.isValid) {
        estateResult[lastFenceIdx - firstFenceIdx - 1].push({
          columns: [firstFenceIdx + 1, lastFenceIdx],
          usedForPlan: res.usedInPlan,
        });
      }
    } else {
      continue;
    }
    firstFenceIdx = lastFenceIdx;
  }

  return estateResult;
}

interface Validator {
  isValid: boolean;
  usedInPlan: boolean;
}

function checkValidEstate(row: Array<House | null>, start: number, end: number): Validator {
  let usedInPlan = false;
  for (let i = start; i <= end; i++) {
    if (row[i] == null) {
      return { isValid: false, usedInPlan };
    } else {
      usedInPlan = usedInPlan || (row[i]?.usedForPlan ?? false);
    }
  }

  if (end - start + 1 > 6) {
    return { isValid: false, usedInPlan };
  }

  return { isValid: true, usedInPlan };
}
