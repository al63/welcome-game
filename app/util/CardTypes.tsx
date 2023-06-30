export interface GameCard {
  value: number;
  backingType: "GARDEN" | "BIS" | "ESTATE" | "TEMP" | "POOL" | "FENCE";
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
