import { CreateGameResponse } from "../api/models";

export async function createGame(players: string[]) {
  const playerIds = players.map((player, index) => player || `Player ${index + 1}`);
  const res = await fetch("/api/game", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ players: playerIds }),
  });
  if (!res.ok) {
    throw "error creating game";
  }
  const json = (await res.json()) as CreateGameResponse;
  return json;
}
