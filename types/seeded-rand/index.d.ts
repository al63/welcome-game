declare class SeededRand {
  constructor(seed: number) {}
  shuffle<T>(array: Array<T>): Array<T>;
}

declare module "seeded-rand" {
  export = SeededRand;
}
