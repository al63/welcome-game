import { GameStateMachine } from "@/app/util/gameStateMachineTypes";
import { screen } from "@testing-library/react";
import { CityPlans } from "./CityPlans";
import { fakeGameState, fakePlayerState } from "@/app/util/testData";
import { render } from "@/app/util/testUtils";

const gameState = fakeGameState({
  plans: [
    {
      firstValue: 10,
      secondValue: 5,
      difficulty: 1,
      requirements: [{ size: 1, quantity: 1 }],
      completed: false,
      turnCompleted: -1,
    },
  ],
});

describe("CityPlans", () => {
  it("Displays the first value of a city plan", () => {
    const state: GameStateMachine = {
      playerId: "bub",
      step: { type: "choose" },
      playerStates: {
        bub: fakePlayerState({
          playerId: "bub",
          completedPlans: [0],
        }),
      },
      gameState,
    };
    render(<CityPlans viewedPlayerId={state.playerId} />, state);
    screen.getByText("10");
  });

  it("handles when we have completed a city plan first", () => {
    const state: GameStateMachine = {
      playerId: "bub",
      step: { type: "choose" },
      playerStates: {
        bub: fakePlayerState({
          playerId: "bub",
          completedPlans: [10],
        }),
      },
      gameState,
    };
    render(<CityPlans viewedPlayerId={state.playerId} />, state);
    screen.getByText("\u2713");
    expect(screen.findByText("10")).not.toBeInTheDocument;
  });

  it("handles when someone else completed a city plan first", () => {
    const state: GameStateMachine = {
      playerId: "bub",
      step: { type: "choose" },
      playerStates: {
        bub: fakePlayerState({
          playerId: "bub",
          completedPlans: [0],
        }),
        bob: fakePlayerState({
          playerId: "bob",
          completedPlans: [10],
        }),
      },
      gameState,
    };

    render(<CityPlans viewedPlayerId={state.playerId} />, state);
    screen.getByText("x");
    expect(screen.findByText("10")).not.toBeInTheDocument;
  });
});
