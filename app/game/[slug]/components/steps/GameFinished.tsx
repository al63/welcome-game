import { useGameStateMachineContext } from "../../GameStateMachineContext";

export function GameFinished() {
  const { gameState } = useGameStateMachineContext();
  const players = Object.keys(gameState.players);

  return (
    <div>
      <h1 className="text-xl font-bold">Game Complete</h1>
      <h2 className="text-lg mt-2">Final Scores</h2>
      {players.map((player) => {
        return (
          <div key={player}>
            <span className="font-bold">{player}</span>: {gameState.players[player].score}
          </div>
        );
      })}
    </div>
  );
}
