import React from "react";
import Image from "next/image";
import { CreateGameResponse } from "../api/models";
import classNames from "classnames";

interface StartGameProps {
  createdGame: CreateGameResponse;
}

export function StartGame({ createdGame }: StartGameProps) {
  const [copiedPlayer, setCopiedPlayer] = React.useState<string>("");

  return (
    <div className="mt-6">
      <h1>To start the game, share the links below to the respective players and click on your own.</h1>
      <ul className="list-disc">
        {createdGame.players.map((player) => {
          const path = `/game/${createdGame.gameId}?player=${player}`;
          const link = `${window.location.href.slice(0, window.location.href.length - 1)}${path}`;
          return (
            <li className="mx-2 my-4 break-all" key={player}>
              <span className="font-semibold">{player}: </span>
              {/* Dont want any prefetching at all, even on hover, so just a tags*/}
              <a className="text-blue-500 underline" href={path}>
                {link}
              </a>
              <div>
                <button
                  className={classNames("self-center px-2 py-1 mt-2 rounded-full flex text-sm", {
                    "bg-amber-300 hover:bg-amber-400": copiedPlayer !== player,
                    "bg-amber-200 text-gray-600": copiedPlayer === player,
                  })}
                  onClick={() => {
                    setCopiedPlayer(player);
                    navigator.clipboard.writeText(link);
                  }}
                >
                  <Image
                    aria-hidden
                    className="inline cursor-pointer hover:bg-slate-200 rounded-full p-1"
                    height="22"
                    width="22"
                    src="/copy.svg"
                    alt={`Copy link for ${player}`}
                  />
                  {copiedPlayer === player ? "Copied" : "Copy Link"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
