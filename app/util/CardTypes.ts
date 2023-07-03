export type GameCardType = "GARDEN" | "BIS" | "ESTATE" | "TEMP" | "POOL" | "FENCE";

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
}

export interface CardState {
  revealedCardValues: GameCard[];
  revealedCardModifiers: GameCardType[];
}
