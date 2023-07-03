"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import { CardState } from "@/app/util/CardTypes";
import React from "react";

interface GameProps {
  playerStates: PlayerStates;
  playerId: string;
  cardState: CardState;
}

export default function Game({ playerStates, cardState, playerId }: GameProps) {
  const [viewedPlayerId, setViewedPlayerId] = React.useState(playerId);

  return (
    <div className="w-full m-2">
      <UserBoard
        playerStates={playerStates}
        cardState={cardState}
        playerId={playerId}
        viewedPlayerId={viewedPlayerId}
      />
      <PlayersGrid playerStates={playerStates} onSetViewedPlayer={setViewedPlayerId} viewedPlayerId={viewedPlayerId} />
    </div>
  );
}
