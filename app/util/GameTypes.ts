import { PlanCard } from "./CardTypes";

export interface GameState {
  id: string;
  seed: number;
  seedOffset: number;
  players: string[];
  plans: Array<PlanCard>;
  turn: number;
  active: boolean;
}
