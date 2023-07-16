import { GameStateMachine } from "@/app/util/gameStateMachineTypes";
import { render as r } from "@testing-library/react";
import { GameStateMachineContext, GameStateMachineDispatchContext } from "../game/[slug]/GameStateMachineContext";

export function render(children: React.ReactNode, state?: GameStateMachine, dispatch?: jest.Mock) {
  return r(
    <GameStateMachineContext.Provider value={state ?? null}>
      <GameStateMachineDispatchContext.Provider value={dispatch ?? null}>
        {children}
      </GameStateMachineDispatchContext.Provider>
    </GameStateMachineContext.Provider>
  );
}
