import { Neighborhood, ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "../../GameStateMachineContext";
import { PendingInfo, useBuildableLocations } from "../../useBuildableLocations";

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
              "bg-green-600 font-bold": count === index,
              "bg-green-300": count < index,
              "bg-green-300 line-through text-gray-400": index < count,
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
    <div className="flex flex-col text-sm items-center">
      <div>{house.value}</div>
      {showModifiers && house.modifier === "BIS" ? <div>BIS</div> : null}
    </div>
  );
}

interface CellProps {
  house: House | null;
  mini: boolean;
  buildable?: boolean;
  pool?: boolean;
  onClick?: () => void;
  pendingHouse?: PendingInfo;
}

function Cell({ house, pool, mini, buildable, onClick, pendingHouse }: CellProps) {
  const renderedHouse = house || pendingHouse?.house;
  const occupied = renderedHouse != null;

  return (
    <div
      className={classNames("border relative flex justify-center items-center", {
        "bg-gray-100": occupied && !buildable,
        "bg-white": !occupied && !buildable,
        "bg-green-300 hover:bg-green-400 cursor-pointer": buildable,
        "border-t-black border-t-2": house?.usedForPlan,
        "w-6 h-6": mini,
        "w-12 h-12": !mini,
      })}
      onClick={onClick}
    >
      {pool && !mini ? <div className="bg-blue-500 w-2 h-2 top-1 right-1 absolute" /> : null}
      {renderedHouse != null ? <House house={renderedHouse} showModifiers={!mini} /> : null}
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
  buildableLocations?: Set<number>;
  onBuild?: (index: number) => void;
  pendingHouses?: Array<PendingInfo>;
}

function UserNeighborhood({ config, houses, fences, mini, buildableLocations, onBuild, pendingHouses }: RowProps) {
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
          const buildable = buildableLocations?.has(index);
          const pendingHouse = pendingHouses?.find((pending) => pending.column === index);
          return (
            <div className="flex" key={index}>
              <Cell
                house={house}
                pool={config.pools.includes(index)}
                mini={mini}
                buildable={buildable}
                onClick={buildable ? () => onBuild?.(index) : undefined}
                pendingHouse={pendingHouse}
              />
              {index < houses.length - 1 ? <Fence active={fenceAfter} mini={mini} /> : null}
            </div>
          );
        })}
        <Fence active mini={mini} />
      </div>
    </div>
  );
}

interface CityProps {
  viewedPlayerId: string;
}

export function UserCity({ viewedPlayerId }: CityProps) {
  const { playerStates } = useGameStateMachineContext();
  const viewedPlayerState = playerStates[viewedPlayerId];
  const buildable = useBuildableLocations(viewedPlayerId);

  const onClick = (row: number, column: number) => {
    buildable?.onChosen?.([row, column]);
  };

  return (
    <div>
      <h1 className="text-xl font-bold p-2 truncate">{`${viewedPlayerState.playerId}'s City: ${viewedPlayerState.cityName}`}</h1>
      <UserNeighborhood
        config={ROW_ONE}
        houses={viewedPlayerState.housesRowOne}
        fences={viewedPlayerState.fencesRowOne}
        buildableLocations={buildable?.buildableHouses?.[0]}
        mini={false}
        onBuild={(index) => onClick(0, index)}
        pendingHouses={buildable?.pendingHouses?.[0]}
      />
      <UserNeighborhood
        config={ROW_TWO}
        houses={viewedPlayerState.housesRowTwo}
        fences={viewedPlayerState.fencesRowTwo}
        buildableLocations={buildable?.buildableHouses?.[1]}
        mini={false}
        onBuild={(index) => onClick(1, index)}
        pendingHouses={buildable?.pendingHouses?.[1]}
      />
      <UserNeighborhood
        config={ROW_THREE}
        houses={viewedPlayerState.housesRowThree}
        fences={viewedPlayerState.fencesRowThree}
        buildableLocations={buildable?.buildableHouses?.[2]}
        mini={false}
        onBuild={(index) => onClick(2, index)}
        pendingHouses={buildable?.pendingHouses?.[2]}
      />
    </div>
  );
}

export function MiniUserCity({ playerId }: { playerId: string }) {
  const { playerStates } = useGameStateMachineContext();
  const viewedPlayerState = playerStates[playerId];

  return (
    <div className="max-w-xs">
      <h1 className="text-xl font-bold p-2 truncate">{`${viewedPlayerState.playerId}'s City: ${viewedPlayerState.cityName}`}</h1>
      <UserNeighborhood
        config={ROW_ONE}
        houses={viewedPlayerState.housesRowOne}
        fences={viewedPlayerState.fencesRowOne}
        mini
      />
      <UserNeighborhood
        config={ROW_TWO}
        houses={viewedPlayerState.housesRowTwo}
        fences={viewedPlayerState.fencesRowTwo}
        mini
      />
      <UserNeighborhood
        config={ROW_THREE}
        houses={viewedPlayerState.housesRowThree}
        fences={viewedPlayerState.fencesRowThree}
        mini
      />
    </div>
  );
}
