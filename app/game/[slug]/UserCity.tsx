import { Neighborhood, ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House, PlayerState } from "@/app/util/PlayerTypes";
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
            className={`m-1 rounded-full text-center w-6 ${count >= index ? "bg-green-600" : "bg-green-300"}`}
            key={index}
          >
            {score}
          </div>
        );
      })}
    </div>
  );
}

function House({ house, showModifiers }: { house: House; showModifiers: boolean }) {
  return (
    <div className="flex flex-col text-xs items-center">
      <div>{house.value}</div>
      {showModifiers && house.modifier === "BIS" ? <div>BIS</div> : null}
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
    <div
      className={`${occupied ? "bg-gray-100" : "bg-white"} ${
        house?.usedForPlan ? "border-t-black border-t-4" : ""
      } border w-12 h-12 relative flex justify-center items-center`}
    >
      {pool ? <div className="bg-blue-500 w-2 h-2 top-1 right-1 absolute" /> : null}
      {house != null ? <House house={house} showModifiers /> : null}
    </div>
  );
}

function Fence() {
  return <div className={`border-2 border-black w-0 h-12`} />;
}

interface RowProps {
  config: Neighborhood;
  houses: Array<House | null>;
  fences: boolean[];
}

function UserNeighborhood({ config, houses, fences }: RowProps) {
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
          const fenceAfter = index < fences.length && fences[index];
          return (
            <div className="flex" key={index}>
              <Cell house={house} pool={config.pools.includes(index)} />
              {fenceAfter ? <Fence /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniCell({ house }: CellProps) {
  const occupied = house != null;
  return (
    <div className={`${occupied ? "bg-gray-100" : ""} border w-6 h-6 relative flex justify-center items-center`}>
      {house != null ? <House house={house} showModifiers={false} /> : null}
    </div>
  );
}

function MiniUserNeighborhood({ config, houses, fences }: RowProps) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex mb-2">
        {houses.map((house, index) => {
          return <MiniCell key={index} house={house} pool={config.pools.includes(index)} />;
        })}
      </div>
    </div>
  );
}

interface NeighborhoodProps {
  playerState: PlayerState;
  mini?: boolean;
}

export function UserCity({ playerState, mini }: NeighborhoodProps) {
  const Component = mini ? MiniUserNeighborhood : UserNeighborhood;

  return (
    <div>
      <Component config={ROW_ONE} houses={playerState.housesRowOne} fences={playerState.fencesRowOne} />
      <Component config={ROW_TWO} houses={playerState.housesRowTwo} fences={playerState.fencesRowTwo} />
      <Component config={ROW_THREE} houses={playerState.housesRowThree} fences={playerState.fencesRowThree} />
    </div>
  );
}
