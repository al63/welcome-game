"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import { CardState } from "@/app/util/CardTypes";
import React from "react";
import { EventLog } from "./EventLog";
import { Turn } from "./Turn";
import { Cards } from "./Cards";

interface GameProps {
  playerStates: PlayerStates;
  playerId: string;
  cardState: CardState;
}

export default function Game({ playerStates, cardState, playerId }: GameProps) {
  const [viewedPlayerId, setViewedPlayerId] = React.useState(playerId);

  return (
    <div className="w-full m-2">
      <div className="flex">
        <UserBoard
          playerStates={playerStates}
          cardState={cardState}
          playerId={playerId}
          viewedPlayerId={viewedPlayerId}
        />
        <div className="flex flex-col mx-4 mt-4">
          <Turn cardState={cardState} />
          <div className="mt-auto">
            <EventLog />
          </div>
        </div>
      </div>
      <PlayersGrid playerStates={playerStates} onSetViewedPlayer={setViewedPlayerId} viewedPlayerId={viewedPlayerId} />
    </div>
  );
}
