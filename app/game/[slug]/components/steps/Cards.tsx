import { GameCard, GameCardType } from "@/app/util/CardTypes";
import { Card, modifierDisplayName } from "./Card";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseCard, submitSkipTurn } from "../../GameStateMachineActions";
import { GameState } from "@/app/util/GameTypes";

interface CardsProps {
  gameState: GameState;
  playerId: string;
}

export async function Cards({ gameState, playerId }: CardsProps) {
  const dispatch = useGameStateMachineDispatch();
  const upcoming = gameState.revealedCardValues.map((card) => modifierDisplayName(card.backingType));

  return (
    <div>
      <p className="italic text-xs">{`Upcoming: ${upcoming.join(", ")}`}</p>
      <div className="flex flex-row">
        {gameState.revealedCardValues.map((card: GameCard, index: number) => {
          return (
            <Card
              value={card.value}
              backingModifier={card.backingType}
              key={index}
              type="number"
              onClick={() => {
                dispatch(chooseCard(card.value, gameState.revealedCardModifiers[index]));
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-row">
        {gameState.revealedCardModifiers.map((modifier: GameCardType, index: number) => {
          return <Card modifier={modifier} key={index} type="modifier" />;
        })}
      </div>
      <button
        className="px-8 py-2 rounded-full bg-red-400 hover:bg-red-500 mt-4"
        onClick={async () => dispatch(await submitSkipTurn(gameState, playerId))}
      >
        Skip turn
      </button>
    </div>
  );
}
