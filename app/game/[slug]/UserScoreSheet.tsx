import { PlayerStates } from "@/app/util/PlayerTypes";
import {
  BIS_SCORES,
  ESTATE_MODIFIERS,
  EstatesScore,
  PERMIT_REFUSAL_SCORES,
  POOL_SCORES,
  TEMP_SCORES,
} from "@/app/util/Scoring";
import { computeScore } from "@/app/util/Scoring";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "./GameStateMachineContext";

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
    <div className={`${color} group relative p-2 flex flex-col items-center rounded-lg min-w-fit`}>
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
      className={classNames("flex items-center justify-center h-6 w-6 rounded-md text-sm bg-white", {
        "font-bold": active,
        "line-through text-gray-400": checked,
        "text-black": !checked,
      })}
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
            <div className="text-red-700 text-lg font-bold">n&deg;{index + 1}</div>
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
      <div className="grid grid-cols-2 gap-1">
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
    agencies.push(
      <div key={i} className="bg-orange-400 m-2 h-4 w-4 text-lg flex items-center justify-center rotate-45 font-bold">
        {count > i ? "+" : ""}
      </div>
    );
  }

  return (
    <SectionContainer title="Temp Agency">
      <div className="grid grid-cols-3">{agencies}</div>
      <div className="flex mt-2 gap-1">
        {TEMP_SCORES.map((s) => {
          return <Value value={s} active={score === s} key={s} />;
        })}
      </div>
    </SectionContainer>
  );
}

function Estates({ playerModifiers, score }: { playerModifiers: number[]; score: Array<EstatesScore> }) {
  return (
    <SectionContainer title="Real Estate">
      <div className="flex flex-row">
        {ESTATE_MODIFIERS.map((modifiers, index) => {
          return (
            <div className="flex flex-col" key={index}>
              <div className="m-1 bg-violet-400 text-center">{index + 1}</div>
              <div className="flex-grow">
                {modifiers.map((modifier, modifierIndex) => {
                  return (
                    <div className="m-1" key={modifier}>
                      <Value
                        value={modifier}
                        checked={playerModifiers[index] > modifierIndex}
                        active={playerModifiers[index] === modifierIndex}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2">
                x<span className="underline decoration-dotted">{score[index].count} </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

function BIS({ count }: { count: number }) {
  return (
    <SectionContainer title="BIS" negative>
      <div className="grid grid-cols-2 gap-1 min-w-fit">
        {BIS_SCORES.map((score, index) => {
          return <Value value={score} checked={count > index} active={count === index} key={score} />;
        })}
      </div>
    </SectionContainer>
  );
}

function PermitRefusals({ count }: { count: number }) {
  return (
    <SectionContainer title="Refusals" negative>
      {PERMIT_REFUSAL_SCORES.map((s, index) => {
        return (
          <div className="m-1" key={index}>
            <Value value={s} checked={count > index} active={count === index} />
          </div>
        );
      })}
    </SectionContainer>
  );
}

interface UserScoreSheetProps {
  playerId: string;
}

export function UserScoreSheet({ playerId }: UserScoreSheetProps) {
  const { playerStates } = useGameStateMachineContext();
  const playerState = playerStates[playerId];
  const userScores = React.useMemo(() => computeScore(playerId, playerStates), [playerStates, playerId]);
  if (userScores == null || playerState == null) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl">Scoring</h1>
      <div className="flex items-end gap-1">
        <Plans scores={playerState.completedPlans} />
        <Divider symbol="+" />
        <Parks scores={userScores.parks} />
        <Divider symbol="+" />
        <Pools count={userScores.pools.count} score={userScores.pools.score} />
        <Divider symbol="+" />
        <TempAgencies count={userScores.tempAgencies.count} score={userScores.tempAgencies.score} />
        <Divider symbol="+" />
        <Estates playerModifiers={playerState.estateModifiers} score={userScores.estates} />
        <Divider symbol="-" />
        <BIS count={userScores.bis.count} />
        <Divider symbol="-" />
        <PermitRefusals count={playerState.permitRefusals} />
        <Divider symbol="=" />
        <div className="mb-20 ml-2 text-xl font-bold">{userScores.summation}</div>
      </div>
    </>
  );
}
