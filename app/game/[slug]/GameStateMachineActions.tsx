import { GameCardType } from "@/app/util/CardTypes";
import { CancelAction, ChoseCardAction, PlaceCardStep, PlacedCardAction } from "@/app/util/GameStateMachineTypes";

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

export async function placeHouse(position: number[], step: PlaceCardStep): Promise<PlacedCardAction> {
  // TODO: this action needs to POST to submit the turn

  // TODO: need to special case pools. if the placed card is a pool, only set the house modifier if the location is one with a pool.

  // TODO: API we return the new player state, merge it in
  return { type: "placedCard" };
}
