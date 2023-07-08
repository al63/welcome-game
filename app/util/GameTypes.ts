import { GameCard, GameCardType, PlanCard } from "./CardTypes";

export interface FinalScores {
  scoringInfo: Array<ScoringInfo>;
  playerMetadataMap: PlayerMetadataMap;
}

export interface ScoringInfo {
  score: number;
  playerId: string;
}

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
  revealedCardValues: Array<GameCard>;
  revealedCardModifiers: Array<GameCardType>;
  players: PlayerMetadataMap;
  plans: Array<PlanCard>;
  turn: number;
  shuffleOffset: number;
  completed: boolean;
  eligibleShuffles: string[];
  latestEventLog: string[];
  createdAt: Date;
}
