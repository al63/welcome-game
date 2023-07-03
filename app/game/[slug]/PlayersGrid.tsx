import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";

interface PlayersGridProps {
  playerStates: PlayerStates;
}
export function PlayersGrid({ playerStates }: PlayersGridProps) {
  return (
    <div className="my-4">
      <h1 className="text-xl p-2">All Neighborhoods</h1>
      <div className="flex flex-wrap">
        {Object.keys(playerStates).map((playerId) => {
          return (
            <div className="flex flex-col border border-black m-2 p-2 items-center" key={playerId}>
              <h2 className="text-md font-semibold">{playerId}</h2>
              <UserNeighborhood playerState={playerStates[playerId]} mini />
            </div>
          );
        })}
      </div>
    </div>
  );
}
