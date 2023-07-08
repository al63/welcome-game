import { CreateTurnAPIResponse, PollTurnAPIResponse, TurnAction } from "@/app/api/models";
import { GameCardType } from "@/app/util/CardTypes";
import {
  BISStep,
  CancelAction,
  ChoseBISAction,
  ChoseCardAction,
  GameStateMachineAction,
  PlaceCardStep,
  PlacedCardAction,
  TempAgencyModifierChosenAction,
} from "@/app/util/GameStateMachineTypes";
import { GameState } from "@/app/util/GameTypes";
import { ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { GameStateMachineThunk } from "./GameStateMachineContext";
import { ESTATE_MODIFIERS } from "@/app/util/Scoring";

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

export function chooseBIS(duplicatePosition: number[], duplicateValue: number, step: BISStep): ChoseBISAction {
  return {
    type: "choseBis",
    position: step.position,
    house: step.house,
    duplicatePosition,
    duplicateValue,
  };
}

export async function placeHouse(
  gameState: GameState,
  playerState: PlayerState,
  position: number[],
  step: PlaceCardStep
): Promise<PlacedCardAction | GameStateMachineThunk> {
  // for BIS actions, the actual BIS type is applied to the subsequent BIS house, not this one
  let modifier = step.cardType !== "BIS" ? step.cardType : undefined;
  // for pool actions, we only want to count the pool if its a pool location
  if (step.cardType === "POOL") {
    const poolPositions = [ROW_ONE.pools, ROW_TWO.pools, ROW_THREE.pools];
    if (poolPositions[position[0]].indexOf(position[1]) < 0) {
      modifier = undefined;
    }
  } else if (step.cardType === "ESTATE") {
    // for estate actions, it's possible every single real estate size has already been upgraded
    const completedAll = playerState.estateModifiers.every((modifierIndex, index) => {
      return modifierIndex === ESTATE_MODIFIERS[index].length - 1;
    });
    if (completedAll) {
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

  return await submitTurn(
    gameState,
    playerState.playerId,
    {
      type: "standard",
      house,
      housePosition: position,
    },
    undefined
  );
}

export async function submitSkipTurn(gameState: GameState, playerId: string): Promise<GameStateMachineThunk> {
  return await submitTurn(gameState, playerId, { type: "refusal" }, undefined);
}

export async function submitBISTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  bisHouse: House,
  bisPosition: number[]
): Promise<GameStateMachineThunk> {
  return await submitTurn(
    gameState,
    playerId,
    {
      type: "bis",
      house,
      housePosition,
      bisHouse,
      bisPosition,
    },
    undefined
  );
}

export async function submitEstateTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  sizeIncreased: number
): Promise<GameStateMachineThunk> {
  return await submitTurn(
    gameState,
    playerId,
    {
      type: "estate",
      house,
      housePosition,
      sizeIncreased,
    },
    undefined
  );
}

export async function submitFenceTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  fencePosition: number[]
) {
  return await submitTurn(
    gameState,
    playerId,
    {
      type: "fence",
      house,
      housePosition,
      fencePosition,
    },
    undefined
  );
}

export async function submitTurn(
  gameState: GameState,
  playerId: string,
  action: TurnAction,
  shuffle: boolean | undefined
): Promise<GameStateMachineThunk> {
  return async (dispatch: React.Dispatch<GameStateMachineAction>) => {
    dispatch({ type: "submitting" });
    try {
      const res = await fetch("/api/turn", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameState.id,
          playerId,
          turn: gameState.turn,
          action,
          shuffle,
        }),
      });

      const json = (await res.json()) as CreateTurnAPIResponse;
      if (!res.ok) {
        console.log(json);
        dispatch({ type: "error" });
        return;
      }

      if (json.promptReshuffle) {
        if (action.type !== "refusal") {
          dispatch({ type: "promptReshuffle", pendingAction: action });
        } else {
          throw "Unexpected reshuffle request for permit refusal";
        }
      } else {
        dispatch({ type: "submitted", playerState: json.playerState });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: "error" });
    }
  };
}

export async function poll(gameState: GameState, playerId: string) {
  const { id, turn } = gameState;
  return async (dispatch: React.Dispatch<GameStateMachineAction>) => {
    try {
      let endpoint = `/api/poll?gameId=${id}&turn=${turn + 1}&playerId=${playerId}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const json = (await res.json()) as PollTurnAPIResponse;
      if (!res.ok || json.result === "ERROR") {
        console.log(json);
        dispatch({ type: "error" });
      } else if (json.result === "RESUME") {
        new Audio("/notification.mp3").play();
        dispatch({ type: "resume", gameState: json.gameState, playerStates: json.playerStates });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: "error" });
    }
  };
}
