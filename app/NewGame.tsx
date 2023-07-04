"use client";
import React from "react";
import { CreateGameResponse } from "./api/models";
import Link from "next/link";
import { LoadingSpinner } from "./LoadingSpinner";
import classNames from "classnames";

export default function NewGame() {
  const [players, setPlayers] = React.useState<Array<string | null>>([null, null]);
  const [loading, setLoading] = React.useState(false);
  const [createdGame, setCreatedGame] = React.useState<CreateGameResponse | null>(null);

  const onNameChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setCreatedGame(null);
    setPlayers(updated);
  };

  const onNewPlayerClicked = (index: number) => {
    const updated = [...players];
    updated.splice(index + 1, 0, null);
    setCreatedGame(null);
    setPlayers(updated);
  };

  const onRemovePlayerClicked = (index: number) => {
    const updated = [...players];
    updated.splice(index, 1);
    setCreatedGame(null);
    setPlayers(updated);
  };

  const onCreate = async () => {
    setLoading(true);
    const playerIds = players.map((player, index) => player ?? `Player ${index + 1}`);
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
      setCreatedGame(json);
    } catch (e) {
      alert("Error creating game");
    }
    setLoading(false);
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
      <button
        className={classNames("self-center px-8 py-2 mt-7 rounded-full flex", {
          "bg-red-200 hover:bg-red-300": !createdGame && !loading,
          "bg-red-100 text-gray-400": !!createdGame || loading,
        })}
        onClick={onCreate}
        disabled={createdGame != null}
      >
        {loading ? <LoadingSpinner /> : null}
        {loading ? "Creating..." : "Create Game"}
      </button>
      {createdGame != null ? (
        <div className="mt-6">
          <h1>To start the game, share the links below to the respective players and click on your own.</h1>
          <ul className="list-disc">
            {createdGame.players.map((player) => {
              const path = `/game/${createdGame.gameId}?player=${player}`;
              const link = `${window.location.href.slice(0, window.location.href.length - 1)}${path}`;
              return (
                <li className="m-2" key={player}>
                  <span>{player}: </span>
                  <Link className="text-blue-500 underline" href={path}>
                    {link}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
