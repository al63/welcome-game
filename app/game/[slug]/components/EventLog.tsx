import React from "react";
import { useGameStateMachineContext } from "../GameStateMachineContext";

export function EventLog() {
  const { gameState } = useGameStateMachineContext();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.latestEventLog]);

  return (
    <div className="w-96">
      <h1 className="text-lg">Event Log</h1>
      <div
        ref={scrollRef}
        className="border-2 p-1 border-black w-full h-40 rounded-md overflow-scroll whitespace-normal"
      >
        {gameState.latestEventLog.map((event, index) => {
          return (
            <div className="flex" key={index}>
              <pre>&gt; </pre>
              <pre className="whitespace-normal">{event}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
