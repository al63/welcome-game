import { ROW_ONE, ROW_TWO, ROW_THREE } from "@/app/util/Neighborhoods";
import { PlayerState } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";
import { UserScoreSheet } from "./UserScoreSheet";
import { Card } from "./Card";
import { GameCard, GameCardType } from "@/app/util/CardTypes";

interface Props {
  playerState: PlayerState;
  cardState: {
    revealedCardValues: GameCard[];
    revealedCardModifiers: GameCardType[];
  };
}

export function UserBoard({ playerState, cardState }: Props) {
  return (
    <div>
      <div className="flex">
        <div className="flex flex-col">
          <UserNeighborhood config={ROW_ONE} houses={playerState.housesRowOne} fences={playerState.fencesRowOne} />
          <UserNeighborhood config={ROW_TWO} houses={playerState.housesRowTwo} fences={playerState.fencesRowTwo} />
          <UserNeighborhood
            config={ROW_THREE}
            houses={playerState.housesRowThree}
            fences={playerState.fencesRowThree}
          />
        </div>
        <div>
          {cardState.revealedCardValues.map((card: GameCard, index: number) => {
            return <Card value={card.value} modifier={card.backingType} index={index} />;
          })}
        </div>
        <div>
          {cardState.revealedCardValues.map((card: GameCard, index: number) => {
            return <Card value={null} modifier={card.backingType} index={index + 1} />;
          })}
        </div>
      </div>
      <UserScoreSheet playerState={playerState} />
    </div>
  );
}
