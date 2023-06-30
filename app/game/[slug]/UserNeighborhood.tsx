import { Neighborhood } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";
import React from "react";

interface ParksProgressProps {
  scores: number[];
  count: number;
}

function ParksProgress({ scores, count }: ParksProgressProps) {
  return (
    <div className="flex">
      {scores.map((score, index) => {
        return (
          <div
            className={`m-1 rounded-full text-center w-6 ${count >= index ? "bg-green-600" : "bg-green-100"}`}
            key={index}
          >
            {score}
          </div>
        );
      })}
    </div>
  );
}

function House({ house }: { house: House }) {
  return (
    <div className="flex flex-col text-xs items-center">
      <div>{house.value}</div>
      {house.modifier === "BIS" ? <div>BIS</div> : null}
    </div>
  );
}

interface CellProps {
  house: House | null;
  pool: boolean;
}

function Cell({ house, pool }: CellProps) {
  const occupied = house != null;
  return (
    <div className={`${occupied ? "bg-gray-100" : ""} border w-12 h-12 relative flex justify-center items-center`}>
      {pool ? <div className="bg-blue-500 w-2 h-2 top-1 right-1 absolute" /> : null}
      {house != null ? <House house={house} /> : null}
    </div>
  );
}

interface NeighborhoodProps {
  config: Neighborhood;
  houses: Array<House | null>;
  fences: boolean[];
}

export function UserNeighborhood({ config, houses, fences }: NeighborhoodProps) {
  const numGardens = React.useMemo(() => {
    return houses.filter((house) => house?.modifier === "GARDEN").length;
  }, [houses]);

  if (config.houses !== houses.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-end">
      <ParksProgress scores={config.parkScores} count={numGardens} />
      <div className="flex mb-2">
        {houses.map((house, index) => {
          return <Cell key={index} house={house} pool={config.pools.includes(index)} />;
        })}
      </div>
    </div>
  );
}
