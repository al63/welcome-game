import {
  ChoseCardAction,
  GameStateMachine,
  GameStateMachineAction,
  PlacedCardAction,
} from "@/app/util/gameStateMachineTypes";
import { ESTATE_MODIFIERS } from "@/app/util/scoring";

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
      let followUp =
        action.cardType === "FENCE" || action.cardType === "BIS" || action.cardType === "ESTATE"
          ? action.cardType
          : undefined;

      if (followUp === "ESTATE") {
        // it's possible there are no possible estates to upgrade, in which case there is no follow up.
        const playerState = state.playerStates[state.playerId];
        const completedAll = playerState.estateModifiers.every((modifierIndex, index) => {
          return modifierIndex === ESTATE_MODIFIERS[index].length - 1;
        });
        if (completedAll) {
          followUp = undefined;
        }
      }

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
        step: { type: "promptReshuffle", pendingAction: action.pendingAction },
      };
    default:
      return state;
  }
}
