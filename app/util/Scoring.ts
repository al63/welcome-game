import { ROW_ONE, ROW_THREE, ROW_TWO } from "./Neighborhoods";
import { PlayerState } from "./PlayerTypes";
import { POOL_SCORES } from "./Pools";

interface UserScore {
  plans: number[];
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
  bis: number;
  permitRefusals: number;
}

export function computeScore(playerId: string, playerStates: PlayerState[]): UserScore | null {
  const playerState = playerStates.find((playerState) => playerState.playerId === playerId);
  if (!playerState) {
    return null;
  }

  const houseRows = [playerState.housesRowOne, playerState.housesRowTwo, playerState.housesRowThree];

  const parks = houseRows.map((row) => {
    return row.reduce((accum, cur) => {
      return accum + (cur?.modifier === "GARDEN" ? 1 : 0);
    }, 0);
  });
  const parkScores = [ROW_ONE.parkScores[parks[0]], ROW_TWO.parkScores[parks[1]], ROW_THREE.parkScores[parks[2]]];

  const pools = houseRows.reduce((accum, cur) => {
    return (
      accum +
      cur.reduce((accum, cur) => {
        return accum + (cur?.modifier === "POOL" ? 1 : 0);
      }, 0)
    );
  }, 0);

  return {
    plans: [0, 0, 0],
    parks: parkScores,
    pools: {
      count: pools,
      score: POOL_SCORES[pools],
    },
    tempAgencies: {
      count: 0,
      score: 0,
    },
    estates: [0, 0, 0, 0, 0, 0],
    bis: 0,
    permitRefusals: 0,
  };
}
