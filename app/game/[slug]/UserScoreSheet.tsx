import { ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House, PlayerState } from "@/app/util/PlayerTypes";
import { POOL_SCORES } from "@/app/util/Pools";
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

function Plans({ completedPlans }: { completedPlans: number[] }) {
  return (
    <SectionContainer title="Plans">
      {completedPlans.map((plan, index) => {
        return (
          <div className="text-center" key={index}>
            <div className="text-red-600 text-lg">{`n${index + 1}`}</div>
            <Score score={plan} />
          </div>
        );
      })}
    </SectionContainer>
  );
}

function Parks({ houseRows }: { houseRows: Array<Array<House | null>> }) {
  const scores = houseRows.map((row) => {
    return row.reduce((accum, cur) => {
      return accum + (cur?.modifier === "GARDEN" ? 1 : 0);
    }, 0);
  });

  return (
    <SectionContainer title="Parks">
      <Score score={ROW_ONE.parkScores[scores[0]]} />
      <Score score={ROW_TWO.parkScores[scores[1]]} />
      <Score score={ROW_THREE.parkScores[scores[2]]} />
    </SectionContainer>
  );
}

function Pools({ houseRows }: { houseRows: Array<Array<House | null>> }) {
  const pools = houseRows.reduce((accum, cur) => {
    return (
      accum +
      cur.reduce((accum, cur) => {
        return accum + (cur?.modifier === "POOL" ? 1 : 0);
      }, 0)
    );
  }, 0);

  return (
    <SectionContainer title="Pools">
      <div className="grid grid-cols-2">
        {POOL_SCORES.map((score, index) => {
          return <Value value={score} checked={pools > index} active={pools === index} key={score} />;
        })}
      </div>
    </SectionContainer>
  );
}

export function UserScoreSheet({ playerState }: { playerState: PlayerState }) {
  const houseRows = [playerState.housesRowOne, playerState.housesRowTwo, playerState.housesRowThree];

  return (
    <div className="flex items-end">
      <Plans completedPlans={playerState.completedPlans} />
      <Parks houseRows={houseRows} />
      <Pools houseRows={houseRows} />
    </div>
  );
}
