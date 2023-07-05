import { GameCard, GameCardType, PlanCard } from "./CardTypes";

interface PlayerMetadata {
  score: number;
  turn: number;
}
export interface PlayerMetadataMap {
  [player: string]: PlayerMetadata;
}

export interface GameState {
  id: string;
  seed: number;
  seedOffset: number;
  revealedCardValues: Array<GameCard>;
  revealedCardModifiers: Array<GameCardType>;
  players: PlayerMetadataMap;
  plans: Array<PlanCard>;
  turn: number;
  completed: boolean;
  latestEventLog: string[];
}
