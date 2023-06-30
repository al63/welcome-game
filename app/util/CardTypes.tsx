export type GameCardType = "GARDEN" | "BIS" | "ESTATE" | "TEMP" | "POOL" | "FENCE";

export interface GameCard {
  value: number;
  backingType: GameCardType;
}

interface SizeRequirement {
  size: number;
  quantity: number;
}

export interface PlanCard {
  firstValue: number;
  secondValue: number;
  difficulty: 1 | 2 | 3;
  requirement: SizeRequirement[];
}
