import { GameCard, GameCardType, PlanCard } from "./CardTypes";

export interface PlayerScores {
  [player: string]: number | null;
}

export interface GameState {
  id: string;
  seed: number;
  seedOffset: number;
  revealedCardValues: Array<GameCard>;
  revealedCardModifiers: Array<GameCardType>;
  players: PlayerScores;
  plans: Array<PlanCard>;
  turn: number;
  active: boolean;
}
