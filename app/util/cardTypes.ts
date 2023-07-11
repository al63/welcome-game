export type GameCardType = "PARK" | "BIS" | "ESTATE" | "TEMP" | "POOL" | "FENCE";

export interface GameCard {
  value: number;
  backingType: GameCardType;
}

interface SizeRequirements {
  size: number;
  quantity: number;
}

export interface PlanCard {
  firstValue: number;
  secondValue: number;
  difficulty: 1 | 2 | 3;
  requirements: SizeRequirements[];
  completed: boolean;
  turnCompleted: number;
}
