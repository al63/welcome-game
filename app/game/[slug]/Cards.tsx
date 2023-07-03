import { CardState, GameCard, GameCardType } from "@/app/util/CardTypes";
import { Card, modifierDisplayName } from "./Card";

interface CardsProps {
  cardState: CardState;
}

export function Cards({ cardState }: CardsProps) {
  const upcoming = cardState.revealedCardValues.map((card) => modifierDisplayName(card.backingType));
  return (
    <div>
      <p className="italic text-xs">{`Upcoming: ${upcoming.join(", ")}`}</p>
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
  );
}
