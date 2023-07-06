import { GameCard, GameCardType } from "@/app/util/CardTypes";
import { Card, modifierDisplayName } from "./Card";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseCard, submitSkipTurn } from "../../GameStateMachineActions";
import { GameState } from "@/app/util/GameTypes";

interface CardsProps {
  playerId: string;
  gameState: GameState;
}

export function Cards({ gameState, playerId }: CardsProps) {
  const dispatch = useGameStateMachineDispatch();
  const upcoming = gameState.revealedCardValues.map((card) => modifierDisplayName(card.backingType));

  return (
    <div>
      <div className="flex flex-row">
        {gameState.revealedCardValues.map((card: GameCard, index: number) => {
          return (
            <Card
              value={card.value}
              modifier={gameState.revealedCardModifiers[index]}
              key={index}
              onClick={() => {
                dispatch(chooseCard(card.value, gameState.revealedCardModifiers[index]));
              }}
            />
          );
        })}
      </div>
      <p className="mt-2 italic text-sm">{`Upcoming: ${upcoming.join(", ")}`}</p>
      <button
        onClick={async () => {
          dispatch(await submitSkipTurn(gameState, playerId));
        }}
        className="px-8 py-2 rounded-full bg-red-400 hover:bg-red-500 mt-4"
      >
        Skip turn
      </button>
    </div>
  );
}
