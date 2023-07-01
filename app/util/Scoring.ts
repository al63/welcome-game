import { GameCardType } from "./CardTypes";
import { ROW_ONE, ROW_THREE, ROW_TWO } from "./Neighborhoods";
import { House, PlayerState } from "./PlayerTypes";

export const POOL_SCORES = [0, 3, 6, 9, 13, 17, 21, 26, 31, 36];
export const TEMP_SCORES = [7, 4, 1];
export const BIS_SCORES = [0, 1, 3, 6, 9, 12, 16, 20, 24, 28];

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
  estates: number[];
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

export function computeScore(playerId: string, playerStates: PlayerState[]): UserScore | null {
  const playerState = playerStates.find((playerState) => playerState.playerId === playerId);
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
  const tempAgenciesByPlayer = playerStates
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

  const bis = houseRows.reduce((accum, cur) => accum + countType(cur, "BIS"), 0);
  const bisScore = BIS_SCORES[bis] ?? 0;

  const summation =
    plansScores + parkScores[0] + parkScores[1] + parkScores[2] + poolsScore + tempAgenciesScore - bisScore;

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
    estates: [0, 0, 0, 0, 0, 0],
    bis: {
      count: bis,
      score: bisScore,
    },
    permitRefusals: 0,
    summation,
  };
}
