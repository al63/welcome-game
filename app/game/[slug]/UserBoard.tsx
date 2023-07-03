import { ROW_ONE, ROW_TWO, ROW_THREE } from "@/app/util/Neighborhoods";
import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";
import { UserScoreSheet } from "./UserScoreSheet";
import { Card, UpcomingCards } from "./Card";
import { CardState, GameCard, GameCardType } from "@/app/util/CardTypes";
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
    <div>
      <h1 className="text-xl p-2">{`${viewedPlayerId}'s Neighborhood`}</h1>
      <div className="flex">
        <div className="mr-4">
          <UserNeighborhood playerState={playerState} />
        </div>
        <Cards cardState={cardState} />
      </div>
      <UserScoreSheet playerStates={playerStates} playerId={viewedPlayerId} />
    </div>
  );
}
