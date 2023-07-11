import React from "react";

interface PlayersProps {
  players: string[];
  onUpdate: (players: string[]) => void;
}

export function Players({ players, onUpdate }: PlayersProps) {
  const onNameChange = React.useCallback(
    (index: number, value: string) => {
      const updated = [...players];
      updated[index] = value;
      onUpdate(updated);
    },
    [onUpdate, players]
  );

  const onNewPlayerClicked = React.useCallback(
    (index: number) => {
      const updated = [...players];
      updated.splice(index + 1, 0, "");
      onUpdate(updated);
    },
    [onUpdate, players]
  );

  const onRemovePlayerClicked = React.useCallback(
    (index: number) => {
      const updated = [...players];
      updated.splice(index, 1);
      onUpdate(updated);
    },
    [onUpdate, players]
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-xl my-4 font-semibold">Players</h2>
      {players.map((player, index) => {
        return (
          <div key={index} className="flex mb-2">
            <input
              className="border rounded-sm flex-grow p-1 w-72"
              maxLength={20}
              placeholder={`Player ${index + 1}`}
              value={player}
              onChange={(e) => onNameChange(index, e.target.value)}
            />
            {players.length < 6 ? (
              <button
                aria-label="Add new player"
                className="ml-2 hover:bg-slate-200 px-3 rounded-full"
                onClick={() => onNewPlayerClicked(index)}
              >
                +
              </button>
            ) : null}
            {players.length > 2 ? (
              <button
                aria-label={`Remove ${player || "player"}`}
                className="ml-2 hover:bg-slate-200 px-3 rounded-full"
                onClick={() => onRemovePlayerClicked(index)}
              >
                -
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
