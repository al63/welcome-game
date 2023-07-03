import { ROW_ONE, ROW_TWO, ROW_THREE } from "@/app/util/Neighborhoods";
import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";
import { UserScoreSheet } from "./UserScoreSheet";
import { Card, UpcomingCards } from "./Card";
import { CardState, GameCard, GameCardType } from "@/app/util/CardTypes";

interface Props {
  playerStates: PlayerStates;
  playerId: string;
  cardState: CardState;
}

export function UserBoard({ playerStates, playerId, cardState }: Props) {
  const playerState = playerStates[playerId];
  return (
    <div>
      <h1 className="text-xl p-2">{`${playerId}'s Neighborhood`}</h1>
      <div className="flex">
        <div className="mr-4">
          <UserNeighborhood playerState={playerState} />
        </div>
        <div>
          <UpcomingCards upcoming={cardState.revealedCardValues.map((card) => card.backingType)} />
          <div className="flex flex-row">
            {cardState.revealedCardValues.map((card: GameCard, index: number) => {
              return <Card value={card.value} backingModifier={card.backingType} key={index} type="number" />;
            })}
          </div>
          <div className="flex flex-row">
            {cardState.revealedCardModifiers.map((modifier: GameCardType, index: number) => {
              return <Card modifier={modifier} key={index} type="modifier" />;
            })}
          </div>
        </div>
      </div>
      <UserScoreSheet playerStates={playerStates} playerId={playerId} />
    </div>
  );
}
