interface Neighborhood {
  houses: number;
  pools: number[];
  parkScores: number[];
}
export const ROW_ONE: Neighborhood = {
  houses: 10,
  pools: [2, 6, 7],
  parkScores: [0, 2, 4, 10],
};

export const ROW_TWO: Neighborhood = {
  houses: 11,
  pools: [0, 3, 7],
  parkScores: [0, 2, 4, 6, 14],
};

export const ROW_THREE: Neighborhood = {
  houses: 12,
  pools: [1, 6, 10],
  parkScores: [0, 2, 4, 6, 8, 18],
};
