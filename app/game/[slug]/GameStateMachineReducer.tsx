import { ChoseCardAction, GameStateMachine, GameStateMachineAction } from "@/app/util/GameStateMachineTypes";

function reduceChoseAction(state: GameStateMachine, action: ChoseCardAction): GameStateMachine {
  switch (action.cardType) {
    case "POOL":
    case "GARDEN":
      return {
        ...state,
        step: {
          type: "placeCard",
          cardValue: action.cardValue,
          cardType: action.cardType,
        },
      };
    case "TEMP":
      return {
        ...state,
        step: {
          type: "temp",
          cardValue: action.cardValue,
        },
      };
    case "BIS":
    case "ESTATE":
    case "FENCE":
      // TODO:
      return {
        ...state,
        step: {
          type: "choose",
        },
      };
  }
}

export function gameStateMachineReducer(state: GameStateMachine, action: GameStateMachineAction): GameStateMachine {
  switch (action.type) {
    case "tempAgencyModifierChosen": {
      return {
        ...state,
        step: {
          type: "placeCard",
          cardValue: action.value,
          cardType: "TEMP",
        },
      };
    }
    case "placedCard": {
      return {
        ...state,
        step: {
          type: "wait",
        },
      };
    }
    case "cancel": {
      return {
        ...state,
        step: {
          type: "choose",
        },
      };
    }
    case "choseCard":
      return reduceChoseAction(state, action);
    default:
      return state;
  }
}
