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
import { House } from "@/app/util/PlayerTypes";
import { GameStateMachineThunk } from "./GameStateMachineContext";

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
  playerId: string,
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

  return await submitTurn(gameState, playerId, {
    type: "standard",
    house,
    housePosition: position,
  });
}

export async function submitBISTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  bisHouse: House,
  bisPosition: number[]
): Promise<GameStateMachineThunk> {
  return await submitTurn(gameState, playerId, {
    type: "bis",
    house,
    housePosition,
    bisHouse,
    bisPosition,
  });
}

export async function submitEstateTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  sizeIncreased: number
): Promise<GameStateMachineThunk> {
  return await submitTurn(gameState, playerId, {
    type: "estate",
    house,
    housePosition,
    sizeIncreased,
  });
}

export async function submitFenceTurn(
  gameState: GameState,
  playerId: string,
  house: House,
  housePosition: number[],
  fencePosition: number[]
) {
  return await submitTurn(gameState, playerId, {
    type: "fence",
    house,
    housePosition,
    fencePosition,
  });
}

export async function submitTurn(
  gameState: GameState,
  playerId: string,
  action: TurnAction
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
        }),
      });

      const json = (await res.json()) as CreateTurnAPIResponse;
      if (!res.ok) {
        console.log(json);
        dispatch({ type: "error" });
        return;
      }

      dispatch({ type: "submitted", playerState: json.playerState });
    } catch (e) {
      console.log(e);
      dispatch({ type: "error" });
    }
  };
}

export async function poll(gameId: string, turn: number) {
  return async (dispatch: React.Dispatch<GameStateMachineAction>) => {
    try {
      const res = await fetch(`/api/poll?gameId=${gameId}&turn=${turn}`, {
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
        dispatch({ type: "resume", gameState: json.gameState, playerStates: json.playerStates });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: "error" });
    }
  };
}
