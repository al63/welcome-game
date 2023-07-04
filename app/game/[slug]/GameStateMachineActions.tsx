import { GameCardType } from "@/app/util/CardTypes";
import { CancelAction, ChooseAction } from "@/app/util/GameStateMachineTypes";

export function chooseCard(cardValue: number, cardType: GameCardType): ChooseAction {
  return {
    type: "choose",
    cardValue,
    cardType,
  };
}

export function cancelAction(): CancelAction {
  return { type: "cancel" };
}
