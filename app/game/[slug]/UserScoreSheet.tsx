import { PlayerState } from "@/app/util/PlayerTypes";
import { BIS_SCORES, PERMIT_REFUSAL_SCORES, POOL_SCORES, TEMP_SCORES } from "@/app/util/Scoring";
import { computeScore } from "@/app/util/Scoring";
import React from "react";

function Divider({ symbol }: { symbol: string }) {
  return <div className="mb-20 text-xl font-bold">{symbol}</div>;
}

function SectionContainer({
  children,
  title,
  negative,
}: {
  children: React.ReactNode;
  title: string;
  negative?: boolean;
}) {
  const color = negative ? "bg-red-300" : "bg-blue-300";
  return (
    <div className={`${color} p-2 m-2 flex flex-col items-center rounded-lg`}>
      <h1 className="text-gray-600 text-lg">{title}</h1>
      {children}
    </div>
  );
}

function Score({ score }: { score: number }) {
  return <div className="m-1 flex items-center justify-center h-8 w-8 rounded-full bg-white text-black">{score}</div>;
}

function Value({ value, checked, active }: { value?: number; checked?: boolean; active?: boolean }) {
  return (
    <div
      className={`${active ? "font-bold" : ""} ${
        checked ? "line-through" : ""
      } m-1 flex items-center justify-center h-6 w-6 rounded-md text-sm text-black bg-white`}
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
        {TEMP_SCORES.map((s) => {
          return <Value value={s} active={score === s} key={s} />;
        })}
      </div>
    </SectionContainer>
  );
}

function BIS({ count, score }: { count: number; score: number }) {
  return (
    <SectionContainer title="BIS" negative>
      <div className="grid grid-cols-2">
        {BIS_SCORES.map((score, index) => {
          return <Value value={score} checked={count > index} active={count === index} key={score} />;
        })}
      </div>
    </SectionContainer>
  );
}

function PermitRefusals({ count, score }: { count: number; score: number }) {
  return (
    <SectionContainer title="Oopsies" negative>
      {PERMIT_REFUSAL_SCORES.map((s, index) => {
        return <Value value={s} checked={count > index} active={count === index} key={s} />;
      })}
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
      <Divider symbol="+" />
      <Parks scores={userScores.parks} />
      <Divider symbol="+" />
      <Pools count={userScores.pools.count} score={userScores.pools.score} />
      <Divider symbol="+" />
      <TempAgencies count={userScores.tempAgencies.count} score={userScores.tempAgencies.score} />
      <Divider symbol="-" />
      <BIS count={userScores.bis.count} score={userScores.bis.score}></BIS>
      <Divider symbol="-" />
      <PermitRefusals count={playerState.permitRefusals} score={userScores.permitRefusals} />
      <Divider symbol="=" />
      <div className="mb-20 ml-2 text-xl font-bold">{userScores.summation}</div>
    </div>
  );
}
