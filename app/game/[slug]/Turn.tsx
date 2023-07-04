import { Cards } from "./Cards";
import { GameState } from "@/app/util/GameTypes";

interface TurnProps {
  gameState: GameState;
}

export function Turn({ gameState }: TurnProps) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Turn 1</h1>
      <p>Choose a card to play</p>
      <div className="mt-2">
        <Cards
          revealedCardModifiers={gameState.revealedCardModifiers}
          revealedCardValues={gameState.revealedCardValues}
        />
      </div>
    </div>
  );
}
