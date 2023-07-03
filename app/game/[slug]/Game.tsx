"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import { CardState } from "@/app/util/CardTypes";

interface GameProps {
  playerStates: PlayerStates;
  playerId: string;
  cardState: CardState;
}

export default function Game({ playerStates, cardState, playerId }: GameProps) {
  return (
    <div className="w-full">
      <UserBoard playerStates={playerStates} cardState={cardState} playerId={playerId} />
      <PlayersGrid playerStates={playerStates} />
    </div>
  );
}
