"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import React from "react";
import { EventLog } from "./EventLog";
import { Turn } from "./Turn";
import { Cards } from "./Cards";
import { GameState } from "@/app/util/GameTypes";

interface GameProps {
  playerStates: PlayerStates;
  playerId: string;
  gameState: GameState;
}

export default function Game({ playerStates, gameState, playerId }: GameProps) {
  const [viewedPlayerId, setViewedPlayerId] = React.useState(playerId);

  return (
    <div className="w-full m-2">
      <div className="flex">
        <UserBoard
          playerStates={playerStates}
          playerId={playerId}
          viewedPlayerId={viewedPlayerId}
          plans={gameState.plans}
        />
        <div className="flex flex-col mx-4 mt-4">
          <Turn gameState={gameState} />
          <div className="mt-auto">
            <EventLog />
          </div>
        </div>
      </div>
      <PlayersGrid playerStates={playerStates} onSetViewedPlayer={setViewedPlayerId} viewedPlayerId={viewedPlayerId} />
    </div>
  );
}
