import { GameCard, GameCardType } from "@/app/util/CardTypes";
import { Card, modifierDisplayName } from "./Card";

interface CardsProps {
  revealedCardValues: Array<GameCard>;
  revealedCardModifiers: Array<GameCardType>;
}

export function Cards({ revealedCardValues, revealedCardModifiers }: CardsProps) {
  const upcoming = revealedCardValues.map((card) => modifierDisplayName(card.backingType));
  return (
    <div>
      <p className="italic text-xs">{`Upcoming: ${upcoming.join(", ")}`}</p>
      <div className="flex flex-row">
        {revealedCardValues.map((card: GameCard, index: number) => {
          return <Card value={card.value} backingModifier={card.backingType} key={index} type="number" />;
        })}
      </div>
      <div className="flex flex-row">
        {revealedCardModifiers.map((modifier: GameCardType, index: number) => {
          return <Card modifier={modifier} key={index} type="modifier" />;
        })}
      </div>
    </div>
  );
}
