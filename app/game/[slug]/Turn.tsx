import { Cards } from "./Cards";
import { useGameStateMachineContext } from "./GameStateMachineContext";

export function Turn() {
  const { gameState } = useGameStateMachineContext();

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
