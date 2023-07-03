import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";

interface PlayersGridProps {
  playerStates: PlayerStates;
  onSetViewedPlayer: (playerId: string) => void;
  viewedPlayerId: string;
}

export function PlayersGrid({ playerStates, onSetViewedPlayer, viewedPlayerId }: PlayersGridProps) {
  return (
    <div className="my-4">
      <h1 className="text-xl p-2">All Neighborhoods</h1>
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
              <UserNeighborhood playerState={playerStates[playerId]} mini />
            </div>
          );
        })}
      </div>
    </div>
  );
}
