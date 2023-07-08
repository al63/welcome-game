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
  let type: "chooseBis" | "estate" | "fence";

  switch (action.followUp) {
    case "BIS":
      type = "chooseBis";
      break;
    case "ESTATE":
      type = "estate";
      break;
    case "FENCE":
      type = "fence";
      break;
  }

  return {
    ...state,
    step: {
      type,
      house: action.house,
      position: action.position,
    },
  };
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
    case "submitting":
      return {
        ...state,
        step: { type: "wait" },
      };
    case "submitted":
      return {
        ...state,
        step: { type: "wait" },
        playerStates: {
          ...state.playerStates,
          [state.playerId]: action.playerState,
        },
      };
    case "error":
      return {
        ...state,
        step: { type: "error" },
      };
    case "resume":
      const completed = action.gameState.completed;
      return {
        ...state,
        gameState: action.gameState,
        playerStates: action.playerStates,
        step: {
          type: completed ? "completed" : "choose",
        },
      };
    case "promptReshuffle":
      return {
        ...state,
        step: { type: "promptReshuffle" },
      };
    case "choseReshuffle":
      // If a user is prompted to reshuffle, we bring ourselves back to the wait state.
      // that causes us to poll the API again, but with our reshuffle choice.
      return {
        ...state,
        step: { type: "wait", shouldReshuffle: action.shouldReshuffle },
      };
    default:
      return state;
  }
}
