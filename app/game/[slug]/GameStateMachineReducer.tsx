import {
  ChoseCardAction,
  GameStateMachine,
  GameStateMachineAction,
  PlacedCardAction,
} from "@/app/util/GameStateMachineTypes";

function reduceChoseAction(state: GameStateMachine, action: ChoseCardAction): GameStateMachine {
  switch (action.cardType) {
    case "TEMP":
      return {
        ...state,
        step: {
          type: "temp",
          cardValue: action.cardValue,
        },
      };
    default:
      const followUp =
        action.cardType === "FENCE" || action.cardType === "BIS" || action.cardType === "ESTATE"
          ? action.cardType
          : undefined;
      return {
        ...state,
        step: {
          type: "placeCard",
          cardValue: action.cardValue,
          cardType: action.cardType,
          followUp,
        },
      };
  }
}

function reducePlacedCardAction(state: GameStateMachine, action: PlacedCardAction): GameStateMachine {
  switch (action.followUp) {
    case "BIS":
      return {
        ...state,
        step: {
          type: "chooseBis",
          house: action.house,
          position: action.position,
        },
      };
    case "ESTATE":
      return {
        ...state,
        step: {
          type: "estate",
          house: action.house,
          position: action.position,
        },
      };
    case "FENCE":
      // TODO:
      return state;
  }
}

export function gameStateMachineReducer(state: GameStateMachine, action: GameStateMachineAction): GameStateMachine {
  switch (action.type) {
    case "choseBis": {
      return {
        ...state,
        step: {
          type: "placeBis",
          position: action.position,
          house: action.house,
          duplicateLocation: action.duplicatePosition,
          duplicateValue: action.duplicateValue,
        },
      };
    }
    case "tempAgencyModifierChosen": {
      return {
        ...state,
        step: {
          type: "placeCard",
          cardValue: action.cardValue,
          cardType: "TEMP",
        },
      };
    }
    case "placedCard": {
      return reducePlacedCardAction(state, action);
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
    case "submit":
      return {
        ...state,
        step: { type: "wait" },
      };
    default:
      return state;
  }
}
