import { Neighborhood, ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "./GameStateMachineContext";

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
            className={classNames("m-1 rounded-full text-center w-6", {
              "bg-green-600": count >= index,
              "bg-green-300": count < index,
            })}
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
  pool?: boolean;
  mini: boolean;
}

function Cell({ house, pool, mini }: CellProps) {
  const occupied = house != null;
  return (
    <div
      className={classNames("border relative flex justify-center items-center", {
        "bg-gray-100": occupied,
        "bg-white": !occupied,
        "border-t-black border-t-2": house?.usedForPlan,
        "w-6 h-6": mini,
        "w-12 h-12": !mini,
      })}
    >
      {pool && !mini ? <div className="bg-blue-500 w-2 h-2 top-1 right-1 absolute" /> : null}
      {house != null ? <House house={house} showModifiers={!mini} /> : null}
    </div>
  );
}

function Fence({ mini, active }: { mini: boolean; active: boolean }) {
  return (
    <div
      className={classNames(
        {
          "border-black": active,
          "border-transparent": !active,
          "h-6": mini,
          "h-12": !mini,
        },
        "border w-0"
      )}
    />
  );
}

interface RowProps {
  config: Neighborhood;
  houses: Array<House | null>;
  fences: boolean[];
  mini: boolean;
}

function UserNeighborhood({ config, houses, fences, mini }: RowProps) {
  const numGardens = React.useMemo(() => {
    return houses.filter((house) => house?.modifier === "GARDEN").length;
  }, [houses]);

  if (config.houses !== houses.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-end">
      {mini ? null : <ParksProgress scores={config.parkScores} count={numGardens} />}
      <div className="flex mb-2">
        <Fence active mini={mini} />
        {houses.map((house, index) => {
          const fenceAfter = index < fences.length && fences[index];
          return (
            <div className="flex" key={index}>
              <Cell house={house} pool={config.pools.includes(index)} mini={mini} />
              {index < houses.length - 1 ? <Fence active={fenceAfter} mini={mini} /> : null}
            </div>
          );
        })}
        <Fence active mini={mini} />
      </div>
    </div>
  );
}

interface NeighborhoodProps {
  playerId: string;
  mini?: boolean;
}

export function UserCity({ playerId, mini }: NeighborhoodProps) {
  const { playerStates } = useGameStateMachineContext();
  const playerState = playerStates[playerId];

  return (
    <div className={mini ? "max-w-xs" : ""}>
      <h1 className="text-xl font-bold p-2 truncate">{`${playerState.playerId}'s City: ${playerState.cityName}`}</h1>
      <UserNeighborhood
        config={ROW_ONE}
        houses={playerState.housesRowOne}
        fences={playerState.fencesRowOne}
        mini={!!mini}
      />
      <UserNeighborhood
        config={ROW_TWO}
        houses={playerState.housesRowTwo}
        fences={playerState.fencesRowTwo}
        mini={!!mini}
      />
      <UserNeighborhood
        config={ROW_THREE}
        houses={playerState.housesRowThree}
        fences={playerState.fencesRowThree}
        mini={!!mini}
      />
    </div>
  );
}
