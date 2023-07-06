"use client";
import React from "react";
import { CreateGameResponse } from "../api/models";
import { LoadingSpinner } from "./LoadingSpinner";
import classNames from "classnames";

export default function NewGame() {
  const [players, setPlayers] = React.useState<Array<string>>(["", ""]);
  const [loading, setLoading] = React.useState(false);
  const [createdGame, setCreatedGame] = React.useState<CreateGameResponse | null>(null);

  const onNameChange = React.useCallback(
    (index: number, value: string) => {
      const updated = [...players];
      updated[index] = value;
      setCreatedGame(null);
      setPlayers(updated);
    },
    [players]
  );

  const onNewPlayerClicked = React.useCallback(
    (index: number) => {
      const updated = [...players];
      updated.splice(index + 1, 0, "");
      setCreatedGame(null);
      setPlayers(updated);
    },
    [players]
  );

  const onRemovePlayerClicked = React.useCallback(
    (index: number) => {
      const updated = [...players];
      updated.splice(index, 1);
      setCreatedGame(null);
      setPlayers(updated);
    },
    [players]
  );

  const onCreate = React.useCallback(async () => {
    setLoading(true);
    const playerIds = players.map((player, index) => player || `Player ${index + 1}`);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ players: playerIds }),
      });
      const json = (await res.json()) as CreateGameResponse;
      if (!res.ok) {
        console.log(json);
        alert("Error creating game");
      } else {
        setCreatedGame(json);
      }
    } catch (e) {
      alert("Error creating game");
    }
    setLoading(false);
  }, [players]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col rounded-md">
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
                <button className="ml-2 hover:bg-slate-200 px-3 rounded-full" onClick={() => onNewPlayerClicked(index)}>
                  +
                </button>
              ) : null}
              {players.length > 2 ? (
                <button
                  className="ml-2 hover:bg-slate-200 px-3 rounded-full"
                  onClick={() => onRemovePlayerClicked(index)}
                >
                  -
                </button>
              ) : null}
            </div>
          );
        })}
        <button
          className={classNames("self-center px-8 py-2 mt-4 rounded-full flex", {
            "bg-red-200 hover:bg-red-300": !createdGame && !loading,
            "bg-red-100 text-gray-400": !!createdGame || loading,
          })}
          onClick={onCreate}
          disabled={createdGame != null}
        >
          {loading ? <LoadingSpinner /> : null}
          {loading ? "Creating..." : "Create Game"}
        </button>
      </div>
      {createdGame != null ? (
        <div className="mt-6">
          <h1>To start the game, share the links below to the respective players and click on your own.</h1>
          <ul className="list-disc">
            {createdGame.players.map((player) => {
              const path = `/game/${createdGame.gameId}?player=${player}`;
              const link = `${window.location.href.slice(0, window.location.href.length - 1)}${path}`;
              return (
                <li className="m-2 break-all" key={player}>
                  <span>{player}: </span>
                  <a className="text-blue-500 underline" href={path}>
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
