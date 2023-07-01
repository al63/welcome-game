import { PlayerState } from "@/app/util/PlayerTypes";
import React from "react";

function SectionContainer({ children }: { children: React.ReactElement }) {
  return <div className="bg-blue-300 p-2 m-2 flex flex-col items-center rounded-lg">{children}</div>;
}

function Plans({ completedPlans }: { completedPlans: number[] }) {
  return (
    <SectionContainer>
      <>
        <h1 className="text-gray-600 text-lg">Plans</h1>
        {completedPlans.map((plan, index) => {
          return (
            <div className="mb-1 text-center" key={index}>
              <div className="text-red-600 text-lg">{`n${index + 1}`}</div>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-black">{plan}</div>
            </div>
          );
        })}
      </>
    </SectionContainer>
  );
}

export function UserScoreSheet({ playerState }: { playerState: PlayerState }) {
  return (
    <div className="flex">
      <Plans completedPlans={playerState.completedPlans} />
    </div>
  );
}
