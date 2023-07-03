"use client";
import React from "react";

export default function NewGame() {
  const [players, setPlayers] = React.useState<Array<string | null>>([null, null]);
  const [createdGame, setCreatedGame] = React.useState();

  const onNameChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const onNewPlayerClicked = (index: number) => {
    const updated = [...players];
    updated.splice(index + 1, 0, null);
    setPlayers(updated);
  };

  const onRemovePlayerClicked = (index: number) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  const onCreate = async () => {
    const playerIds = players.map((player, index) => player ?? `Player ${index + 1}`);
    const res = await fetch("/api/game", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ players: playerIds }),
    });
    const json = await res.json();
    console.log(json);
  };

  return (
    <div className="flex flex-col w-96 p-4 rounded-md">
      <h2 className="text-xl my-4">Players</h2>

      {players.map((player, index) => {
        return (
          <div key={index} className="flex mb-2">
            <input
              className="border rounded-sm flex-grow"
              maxLength={16}
              value={player == null ? `Player ${index + 1}` : player}
              onChange={(e) => onNameChange(index, e.target.value)}
            />
            {players.length < 4 ? (
              <button className="ml-2" onClick={() => onNewPlayerClicked(index)}>
                +
              </button>
            ) : null}
            {players.length > 2 ? (
              <button className="ml-2" onClick={() => onRemovePlayerClicked(index)}>
                -
              </button>
            ) : null}
          </div>
        );
      })}
      <button className="self-center px-8 py-2 mt-4 rounded-full bg-red-200" onClick={onCreate}>
        Create Game
      </button>
    </div>
  );
}
