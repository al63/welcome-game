import { GameStep } from "@/app/util/GameStateMachineTypes";
import { Cards } from "./Cards";
import { useGameStateMachineContext, useGameStateMachineDispatch } from "./GameStateMachineContext";
import { modifierDisplayName } from "./Card";
import { GameState } from "@/app/util/GameTypes";
import { cancelAction } from "./GameStateMachineActions";

function StepInstructions({ step }: { step: GameStep }) {
  switch (step.type) {
    case "placeCard":
      return `Choose a location to place the ${step.cardValue} ${modifierDisplayName(step.cardType)} card`;
    case "choose":
      return "Choose a card to play";
    case "wait":
      return (
        <p>
          Waiting for all other players to take their turn <p className="animate-pulse delay-1000 inline">...</p>
        </p>
      );
    default:
      return `oh no something bad happened on step: ${step.type}`;
  }
}

function CancelButton() {
  const dispatch = useGameStateMachineDispatch();
  return (
    <button className="px-8 py-2 rounded-full bg-red-200 hover:bg-red-300" onClick={() => dispatch(cancelAction())}>
      Cancel
    </button>
  );
}

function StepActions({ step, gameState }: { step: GameStep; gameState: GameState }) {
  switch (step.type) {
    case "placeCard":
      return <CancelButton />;
    case "choose":
      return (
        <Cards
          revealedCardModifiers={gameState.revealedCardModifiers}
          revealedCardValues={gameState.revealedCardValues}
        />
      );
    default:
      return null;
  }
}

export function Step() {
  const { step, gameState } = useGameStateMachineContext();

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Turn {gameState.turn + 1}</h1>
      <StepInstructions step={step} />
      <div className="mt-2">
        <StepActions step={step} gameState={gameState} />
      </div>
    </div>
  );
}
