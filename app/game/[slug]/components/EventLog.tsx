import { useGameStateMachineContext } from "../GameStateMachineContext";

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
