import Game from "./components/Game";
import { getGameServerAction } from "@/app/api/game/getGame";
import { dummyGameState, dummyPlayerStates } from "@/app/util/TestData";
import { GameNotFound } from "./components/GameNotFound";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { player: string };
}) {
  const playerId = searchParams?.player;
  let res;

  if (params.slug === "test") {
    res = {
      playerStates: dummyPlayerStates,
      gameState: dummyGameState,
    };
  } else if (playerId != null) {
    res = await getGameServerAction(params.slug, playerId);
  }

  if (res == null || playerId == null) {
    return <GameNotFound />;
  }

  return <Game initialPlayerStates={res.playerStates} playerId={playerId} initialGameState={res.gameState} />;
}
