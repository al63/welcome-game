"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import React from "react";
import { EventLog } from "./EventLog";
import { Turn } from "./Turn";
import { GameState } from "@/app/util/GameTypes";
import { useGameStateMachine } from "./useGameStateMachine";

interface GameProps {
  initialPlayerStates: PlayerStates;
  playerId: string;
  initialGameState: GameState;
}

export default function Game({ initialPlayerStates, initialGameState, playerId }: GameProps) {
  const [viewedPlayerId, setViewedPlayerId] = React.useState(playerId);
  const { step, playerStates, gameState } = useGameStateMachine(initialGameState, initialPlayerStates);

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
