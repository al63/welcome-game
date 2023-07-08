import { GameCard } from "@/app/util/cardTypes";
import { Card, modifierDisplayName } from "./Card";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseCard, submitSkipTurn } from "../../GameStateMachineActions";
import { GameState } from "@/app/util/gameTypes";
import { useHasValidMoves } from "../../useHasValidMoves";

interface CardsProps {
  playerId: string;
  gameState: GameState;
}

export function Cards({ gameState, playerId }: CardsProps) {
  const dispatch = useGameStateMachineDispatch();
  const hasValidMoves = useHasValidMoves(gameState.revealedCardValues);
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
      {!hasValidMoves ? (
        <button
          onClick={async () => {
            dispatch(await submitSkipTurn(gameState, playerId));
          }}
          className="px-8 py-2 rounded-full bg-red-400 hover:bg-red-500 mt-4"
        >
          Skip turn
        </button>
      ) : null}
    </div>
  );
}
