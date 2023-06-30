import { PlanCard } from "../util/CardTypes";

export interface CreateGameAPIRequest {
    seed: number;
    players: string[];
    plans: Array<PlanCard>;
  }