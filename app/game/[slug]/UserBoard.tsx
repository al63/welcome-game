import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserCity } from "./UserCity";
import { UserScoreSheet } from "./UserScoreSheet";
import { CardState } from "@/app/util/CardTypes";
import { Cards } from "./Cards";

interface Props {
  playerStates: PlayerStates;
  playerId: string;
  viewedPlayerId: string;
  cardState: CardState;
}

export function UserBoard({ playerStates, playerId, viewedPlayerId, cardState }: Props) {
  const playerState = playerStates[viewedPlayerId];
  return (
    <div className="bg-orange-100 inline-block p-4 rounded-lg drop-shadow-sm">
      <h1 className="text-xl p-2">{`${viewedPlayerId}'s City`}</h1>
      <div className="flex">
        <div className="mr-4">
          <UserCity playerState={playerState} />
        </div>
        <Cards cardState={cardState} />
      </div>
      <UserScoreSheet playerStates={playerStates} playerId={viewedPlayerId} />
    </div>
  );
}
