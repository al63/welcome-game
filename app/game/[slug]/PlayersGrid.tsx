import { UserCity } from "./UserCity";
import { useGameStateMachineContext } from "./GameStateMachineContext";
import classNames from "classnames";
import React from "react";

interface PlayersGridProps {
  onSetViewedPlayer: (playerId: string) => void;
  playerId: string;
  viewedPlayerId: string;
}

export function PlayersGrid({ onSetViewedPlayer, playerId, viewedPlayerId }: PlayersGridProps) {
  const { step, playerStates } = useGameStateMachineContext();

  React.useEffect(() => {
    if (step.type === "placeCard") {
      onSetViewedPlayer(playerId);
    }
  }, [step.type, onSetViewedPlayer, playerId]);

  return (
    <div className="my-4">
      <h1 className="text-xl p-2">All Cities</h1>
      <div className="flex flex-wrap">
        {Object.keys(playerStates).map((p) => {
          return (
            <div
              className={classNames("flex flex-col border m-2 p-2 items-center cursor-pointer", {
                "border-black": viewedPlayerId === p,
                "border-gray": viewedPlayerId !== p,
              })}
              key={p}
              onClick={() => onSetViewedPlayer(p)}
            >
              <h2 className="text-md font-semibold">{p}</h2>
              <UserCity playerId={p} mini />
            </div>
          );
        })}
      </div>
    </div>
  );
}
