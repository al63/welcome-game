import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Players } from "./Players";

const callback = jest.fn();

beforeEach(() => {
  callback.mockReset();
});

describe("Players", () => {
  it("renders all players", () => {
    const players = ["bub", "bob"];
    render(<Players players={players} onUpdate={callback} />);
    expect(screen.getByDisplayValue("bub")).toBeInTheDocument();
    expect(screen.getByDisplayValue("bob")).toBeInTheDocument();
  });

  it("displays add and remove buttons", () => {
    const players = ["bub", "bob", "bib"];
    render(<Players players={players} onUpdate={callback} />);
    const addButtons = screen.queryAllByText("+");
    expect(addButtons.length).toEqual(3);
    const removeButtons = screen.queryAllByText("-");
    expect(removeButtons.length).toEqual(3);
  });

  it("hides remove buttons if 2 players", () => {
    const players = ["bub", "bob"];
    render(<Players players={players} onUpdate={callback} />);
    const removeButtons = screen.queryAllByText("-");
    expect(removeButtons.length).toEqual(0);
  });

  it("hides add buttons if 6 players", () => {
    const players = ["bub", "bob", "bib", "blub", "bab", "borb"];
    render(<Players players={players} onUpdate={callback} />);
    const removeButtons = screen.queryAllByText("+");
    expect(removeButtons.length).toEqual(0);
  });

  it("adds a player on add click", async () => {
    const players = ["bub", "bob"];
    userEvent.setup();
    render(<Players players={players} onUpdate={callback} />);

    await userEvent.click(screen.queryAllByText("+")[0]);
    expect(callback.mock.calls[0][0]).toEqual(["bub", "", "bob"]);
  });

  it("removes a player on remove click", async () => {
    const players = ["bub", "bob", "borb"];
    userEvent.setup();
    render(<Players players={players} onUpdate={callback} />);

    await userEvent.click(screen.queryAllByText("-")[0]);
    expect(callback.mock.calls[0][0]).toEqual(["bob", "borb"]);
  });
});
