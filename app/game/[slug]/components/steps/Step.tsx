import { GameStep } from "@/app/util/GameStateMachineTypes";
import { Cards } from "./Cards";
import { useGameStateMachineContext } from "../../GameStateMachineContext";
import { modifierDisplayName } from "./Card";
import { GameState } from "@/app/util/GameTypes";
import { TempAgencyModifier } from "./TempAgencyModifier";
import { CancelButton } from "./CancelButton";
import { RealEstateModifier } from "./RealEstateModifier";
import { ChooseBIS } from "./ChooseBIS";
import { PlaceFence } from "./PlaceFence";
import { GameFinished } from "./GameFinished";

function StepInstructions({ step }: { step: GameStep }) {
  switch (step.type) {
    case "completed":
      return null;
    case "error":
      return "Something went horribly wrong - try refreshing your browser";
    case "fence":
      return "Choose on your board the location to place the fence";
    case "placeBis":
      return "Choose on your board the location to place the duplicated house";
    case "chooseBis":
      return "Choose a house on your board duplicate with the BIS effect";
    case "estate":
      return "Increase the value for estates of size:";
    case "temp":
      return "Modify the selected card with a Temp Agency to:";
    case "placeCard":
      return (
        <>
          <p>{`Choose a location on your board to place the ${step.cardValue} ${modifierDisplayName(
            step.cardType
          )} card.`}</p>
          {step.cardType === "POOL" ? (
            <p className="italic text-xs mt-2">Pools only count on locations with blue squares.</p>
          ) : null}
        </>
      );
    case "choose":
      return "Choose a card to play:";
    case "wait":
      return (
        <p>
          Waiting for all other players to take their turn <span className="animate-pulse delay-1000 inline">...</span>
        </p>
      );
    default:
      throw "unhandled step in instrutions";
  }
}

function StepActions({ step, gameState, playerId }: { step: GameStep; gameState: GameState; playerId: string }) {
  switch (step.type) {
    case "completed":
      return <GameFinished />;
    case "fence":
      return <PlaceFence gameState={gameState} playerId={playerId} step={step} />;
    case "chooseBis":
      return <ChooseBIS gameState={gameState} playerId={playerId} step={step} />;
    case "estate":
      return <RealEstateModifier step={step} />;
    case "temp":
      return <TempAgencyModifier value={step.cardValue} />;
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
  const { step, gameState, playerId } = useGameStateMachineContext();

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Turn {gameState.turn}</h1>
      <StepInstructions step={step} />
      <div className="mt-2">
        <StepActions step={step} gameState={gameState} playerId={playerId} />
      </div>
    </div>
  );
}
