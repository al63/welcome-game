import { useGameStateMachineContext } from "../GameStateMachineContext";

const events = [
  "[1] Bub played 7 GARDEN row 1 column 4",
  "[1] Bob played 7 GARDEN row 2 column 3",
  "[1] Bubbo played 7 BIS row 2 column 2",
  "[1] Bibby played 7 ESTATE row 1 column 4, upgrading estates of size 3.",
  "[2] Bub played 7 GARDEN row 1 column 4",
  "[2] Bob played 7 GARDEN row 2 column 3",
  "[2] Bubbo played 7 BIS row 2 column 2",
  "[2] Bibby played 7 ESTATE row 1 column 4, upgrading estates of size 3.",
];

export function EventLog() {
  const { gameState } = useGameStateMachineContext();

  return (
    <div className="m-2">
      <h1 className="text-lg">Event Log</h1>
      <div className="border-2 border-black w-full h-40 rounded-md overflow-scroll whitespace-normal">
        {gameState.latestEventLog.map((event, index) => {
          return (
            <div className="flex p-0.5" key={index}>
              <pre>&gt;</pre>
              <pre className="whitespace-normal">{event}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
