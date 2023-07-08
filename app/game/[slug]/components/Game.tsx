"use client";

import { UserBoard } from "./board/UserBoard";
import { PlayersGrid } from "./PlayersGrid";
import { PlayerStates } from "@/app/util/playerTypes";
import React from "react";
import { EventLog } from "./EventLog";
import { Step } from "./steps/Step";
import { GameState } from "@/app/util/gameTypes";
import { GameStateMachineProvider } from "../GameStateMachineContext";

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
      <div className="min-w-full m-2">
        <div className="flex flex-col items-start lg:items-stretch lg:flex-row">
          <UserBoard viewedPlayerId={viewedPlayerId} />
          <div className="flex flex-row lg:flex-col mx-2 lg:mx-4 mt-4">
            <Step />
            <div className="ml-4 lg:ml-0 lg:mt-auto">
              <EventLog />
            </div>
          </div>
        </div>
        <PlayersGrid onSetViewedPlayer={setViewedPlayerId} playerId={playerId} viewedPlayerId={viewedPlayerId} />
      </div>
    </GameStateMachineProvider>
  );
}
