import { PlayerState } from "@/app/util/PlayerTypes";
import { POOL_SCORES } from "@/app/util/Pools";
import { computeScore } from "@/app/util/Scoring";
import React from "react";

function SectionContainer({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="bg-blue-300 p-2 m-2 flex flex-col items-center rounded-lg">
      <h1 className="text-gray-600 text-lg">{title}</h1>
      {children}
    </div>
  );
}

function Score({ score }: { score: number }) {
  return <div className="m-1 flex items-center justify-center h-8 w-8 rounded-full bg-white text-black">{score}</div>;
}

function Value({ value, checked, active }: { value: number; checked: boolean; active: boolean }) {
  const bg = checked ? "bg-gray-600" : "bg-white";

  return (
    <div
      className={`${bg} ${
        active ? "font-bold" : ""
      } m-1 flex items-center justify-center h-6 w-6 rounded-md text-sm text-black`}
    >
      {value}
    </div>
  );
}

function Plans({ scores }: { scores: number[] }) {
  return (
    <SectionContainer title="Plans">
      {scores.map((score, index) => {
        return (
          <div className="text-center" key={index}>
            <div className="text-red-600 text-lg">{`n${index + 1}`}</div>
            <Score score={score} />
          </div>
        );
      })}
    </SectionContainer>
  );
}

function Parks({ scores }: { scores: number[] }) {
  return (
    <SectionContainer title="Parks">
      {scores.map((score, index) => {
        return <Score score={score} key={index} />;
      })}
    </SectionContainer>
  );
}

function Pools({ count, score }: { count: number; score: number }) {
  return (
    <SectionContainer title="Pools">
      <div className="grid grid-cols-2">
        {POOL_SCORES.map((score, index) => {
          return <Value value={score} checked={count > index} active={count === index} key={score} />;
        })}
      </div>
    </SectionContainer>
  );
}

export function UserScoreSheet({ playerState }: { playerState: PlayerState }) {
  const userScores = React.useMemo(() => computeScore(playerState.playerId, [playerState]), [playerState]);
  if (userScores == null) {
    return null;
  }

  return (
    <div className="flex items-end">
      <Plans scores={userScores.plans} />
      <Parks scores={userScores.parks} />
      <Pools count={userScores.pools.count} score={userScores.pools.score} />
    </div>
  );
}
