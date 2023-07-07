"use client";
import React from "react";
import { CreateGameResponse } from "../api/models";
import { LoadingSpinner } from "./LoadingSpinner";
import classNames from "classnames";
import { Players } from "./Players";
import { StartGame } from "./StartGame";

export default function NewGame() {
  const [players, setPlayers] = React.useState<string[]>(["", ""]);
  const [loading, setLoading] = React.useState(false);
  const [createdGame, setCreatedGame] = React.useState<CreateGameResponse | null>(null);

  const _setPlayers = React.useCallback((players: string[]) => {
    setCreatedGame(null);
    setPlayers(players);
  }, []);

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
      <Players players={players} onUpdate={_setPlayers} />
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
      {createdGame != null ? <StartGame createdGame={createdGame} /> : null}
    </div>
  );
}
