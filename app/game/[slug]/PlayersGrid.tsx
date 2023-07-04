import { UserCity } from "./UserCity";
import { useGameStateMachineContext } from "./GameStateMachineContext";

interface PlayersGridProps {
  onSetViewedPlayer: (playerId: string) => void;
  viewedPlayerId: string;
}

export function PlayersGrid({ onSetViewedPlayer, viewedPlayerId }: PlayersGridProps) {
  const { playerStates } = useGameStateMachineContext();

  return (
    <div className="my-4">
      <h1 className="text-xl p-2">All Cities</h1>
      <div className="flex flex-wrap">
        {Object.keys(playerStates).map((playerId) => {
          const border = viewedPlayerId === playerId ? "border-black" : "border-gray";
          return (
            <div
              className={`${border} flex flex-col border m-2 p-2 items-center cursor-pointer`}
              key={playerId}
              onClick={() => onSetViewedPlayer(playerId)}
            >
              <h2 className="text-md font-semibold">{playerId}</h2>
              <UserCity playerId={playerId} mini />
            </div>
          );
        })}
      </div>
    </div>
  );
}
