import { ChooseAction, GameStateMachine, GameStateMachineAction } from "@/app/util/GameStateMachineTypes";

function reduceChooseAction(state: GameStateMachine, action: ChooseAction): GameStateMachine {
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
    case "BIS":
    case "ESTATE":
    case "TEMP":
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
    case "cancel": {
      return {
        ...state,
        step: {
          type: "choose",
        },
      };
    }
    case "choose":
      return reduceChooseAction(state, action);
    default:
      return state;
  }
}
