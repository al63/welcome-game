import { CreateTurnAPIRequest } from "@/app/api/models";
import { GameCardType } from "@/app/util/CardTypes";
import {
  CancelAction,
  ChoseCardAction,
  PlaceCardStep,
  PlacedCardAction,
  SubmitAction,
  TempAgencyModifierChosenAction,
} from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import { ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";

export function chooseCard(cardValue: number, cardType: GameCardType): ChoseCardAction {
  return {
    type: "choseCard",
    cardValue,
    cardType,
  };
}

export function cancelAction(): CancelAction {
  return { type: "cancel" };
}

export function chooseTempAgencyModifier(cardValue: number): TempAgencyModifierChosenAction {
  return { type: "tempAgencyModifierChosen", cardValue };
}

export async function placeHouse(position: number[], step: PlaceCardStep): Promise<PlacedCardAction | SubmitAction> {
  // for BIS actions, the actual BIS type is applied to the subsequent BIS house, not this one
  let modifier = step.cardType !== "BIS" ? step.cardType : undefined;
  // for pool actions, we only want to count the pool if its a pool location
  if (step.cardType === "POOL") {
    const poolPositions = [ROW_ONE.pools, ROW_TWO.pools, ROW_THREE.pools];
    if (poolPositions[position[0]].indexOf(position[1]) < 0) {
      modifier = undefined;
    }
  }

  const house = {
    value: step.cardValue,
    modifier,
  };

  if (step.followUp) {
    return {
      type: "placedCard",
      followUp: step.followUp,
      position,
      house,
    };
  }

  return await submitTurn(null);
}

export async function submitEstateTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  sizeIncreased: number
): Promise<SubmitAction> {
  return { type: "submit" };
}

export async function submitTurn(data: CreateTurnAPIRequest | null): Promise<SubmitAction> {
  // TODO: this action needs to POST to submit the turn
  return { type: "submit" };
}
