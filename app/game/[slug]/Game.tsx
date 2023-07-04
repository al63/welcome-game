"use client";

import { UserBoard } from "./UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/PlayerTypes";
import React from "react";
import { EventLog } from "./EventLog";
import { Step } from "./Step";
import { GameState } from "@/app/util/GameTypes";
import { GameStateMachineProvider } from "./GameStateMachineContext";

interface GameProps {
  initialPlayerStates: PlayerStates;
  playerId: string;
  initialGameState: GameState;
}

export default function Game({ initialPlayerStates, initialGameState, playerId }: GameProps) {
  const [viewedPlayerId, setViewedPlayerId] = React.useState(playerId);

  return (
    <GameStateMachineProvider
      playerId={playerId}
      initialGameState={initialGameState}
      initialPlayerStates={initialPlayerStates}
    >
      <div className="w-full m-2">
        <div className="flex">
          <UserBoard viewedPlayerId={viewedPlayerId} />
          <div className="flex flex-col mx-4 mt-4">
            <Step />
            <div className="mt-auto">
              <EventLog />
            </div>
          </div>
        </div>
        <PlayersGrid onSetViewedPlayer={setViewedPlayerId} viewedPlayerId={viewedPlayerId} />
      </div>
    </GameStateMachineProvider>
  );
}
