import { GameStep } from "@/app/util/GameStateMachineTypes";
import { Cards } from "./Cards";
import { useGameStateMachineContext, useGameStateMachineDispatch } from "./GameStateMachineContext";
import { modifierDisplayName } from "./Card";
import { GameState } from "@/app/util/GameTypes";
import { cancelAction } from "./GameStateMachineActions";

function stepToInstruction(step: GameStep) {
  switch (step.type) {
    case "placeCard":
      return `Choose a location to place the ${step.cardValue} ${modifierDisplayName(step.cardType)} card`;
    case "choose":
    default:
      return "Choose a card to play";
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
    default:
      return (
        <Cards
          revealedCardModifiers={gameState.revealedCardModifiers}
          revealedCardValues={gameState.revealedCardValues}
        />
      );
  }
}

export function Step() {
  const { step, gameState } = useGameStateMachineContext();

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Turn {gameState.turn + 1}</h1>
      <p>{stepToInstruction(step)}</p>
      <div className="mt-2">
        <StepActions step={step} gameState={gameState} />
      </div>
    </div>
  );
}
