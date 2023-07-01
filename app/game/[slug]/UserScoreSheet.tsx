import { PlayerState } from "@/app/util/PlayerTypes";
import { POOL_SCORES } from "@/app/util/Scoring";
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

function Value({ value, checked, active }: { value?: number; checked?: boolean; active?: boolean }) {
  const bg = checked ? "bg-gray-400" : "bg-white";

  return (
    <div
      className={`${bg} ${
        active ? "font-bold text-black" : "text-gray-500"
      } m-1 flex items-center justify-center h-6 w-6 rounded-md text-sm`}
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

function TempAgencies({ count, score }: { count: number; score: number }) {
  const agencies = [];
  for (let i = 0; i < 11; i++) {
    const bg = count > i ? "bg-orange-600" : "bg-orange-200";
    agencies.push(<div className={`${bg} m-2 rotate-45 h-4 w-4 text-sm`} />);
  }

  return (
    <SectionContainer title="Temp Agency">
      <div className="grid grid-cols-3">{agencies}</div>
      <div className="flex mt-2">
        <Value value={7} active={score === 7} />
        <Value value={4} active={score === 4} />
        <Value value={1} active={score === 1} />
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
      <Plans scores={playerState.completedPlans} />
      <Parks scores={userScores.parks} />
      <Pools count={userScores.pools.count} score={userScores.pools.score} />
      <TempAgencies count={userScores.tempAgencies.count} score={userScores.tempAgencies.score} />
    </div>
  );
}
