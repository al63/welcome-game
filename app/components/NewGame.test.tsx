import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewGame from "./NewGame";
import { render } from "../util/testUtils";

jest.mock("../util/createGame", () => {
  return {
    createGame: () => {
      return {
        gameId: "hello",
        players: ["1", "2"],
      };
    },
  };
});

describe("NewGame", () => {
  it("creates a game on click", async () => {
    userEvent.setup();
    render(<NewGame />);
    expect(screen.queryByTestId("start-game")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Create Game"));
    await screen.findByTestId("start-game");
  });
});
