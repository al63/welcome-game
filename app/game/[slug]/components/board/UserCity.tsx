import { Neighborhood, ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "../../GameStateMachineContext";
import { PendingInfo, useHighlightedLocations } from "./useHighlightedLocations";

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
  highlighted?: boolean;
  pool?: boolean;
  onClick?: () => void;
  pendingHouse?: PendingInfo;
}

function Cell({ house, pool, mini, highlighted, onClick, pendingHouse }: CellProps) {
  const renderedHouse = house || pendingHouse?.house;
  const occupied = renderedHouse != null;

  return (
    <div
      className={classNames("border relative flex justify-center items-center", {
        "bg-gray-100": occupied && !highlighted,
        "bg-white": !occupied && !highlighted,
        "bg-green-300 hover:bg-green-400 cursor-pointer": highlighted,
        "border-t-black border-t-2": house?.usedForPlan,
        "w-6 h-6": mini,
        "w-12 h-12": !mini,
      })}
      onClick={onClick}
    >
      {pool && !mini ? <div className="bg-blue-500 w-2 h-2 top-1 right-1.5 absolute" /> : null}
      {renderedHouse != null ? <House house={renderedHouse} showModifiers={!mini} /> : null}
    </div>
  );
}

interface FenceProps {
  mini: boolean;
  active: boolean;
  highlighted?: boolean;
  onClick?: () => void;
}

function Fence({ mini, active, highlighted, onClick }: FenceProps) {
  return (
    <div
      className={classNames(
        {
          "border-black": active && !highlighted,
          "border-transparent": !active && !highlighted,
          "h-6": mini,
          "h-12": !mini,
        },
        "border w-0 relative"
      )}
    >
      {highlighted ? (
        <div
          className="absolute h-12 w-3 -left-1.5 z-10 bg-green-300 hover:bg-green-400 cursor-pointer"
          onClick={onClick}
        />
      ) : null}
    </div>
  );
}

interface RowProps {
  config: Neighborhood;
  houses: Array<House | null>;
  fences: boolean[];
  mini: boolean;
  highlightedColumns?: Set<number>;
  onHouseClick?: (column: number) => void;
  onFenceClick?: (column: number) => void;
  pendingHouses?: Array<PendingInfo>;
  highlightedFences?: Set<number>;
}

function UserNeighborhood({
  config,
  houses,
  fences,
  mini,
  highlightedColumns,
  onHouseClick,
  onFenceClick,
  pendingHouses,
  highlightedFences,
}: RowProps) {
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
          const highlighted = highlightedColumns?.has(index);
          const highlightedFence = highlightedFences?.has(index);
          const pendingHouse = pendingHouses?.find((pending) => pending.column === index);
          return (
            <div className="flex" key={index}>
              <Cell
                house={house}
                pool={config.pools.includes(index)}
                mini={mini}
                highlighted={highlighted}
                onClick={highlighted ? () => onHouseClick?.(index) : undefined}
                pendingHouse={pendingHouse}
              />
              {index < houses.length - 1 ? (
                <Fence
                  active={fenceAfter}
                  mini={mini}
                  highlighted={highlightedFence}
                  onClick={highlightedFence ? () => onFenceClick?.(index) : undefined}
                />
              ) : null}
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
  const highlighted = useHighlightedLocations(viewedPlayerId);

  const onHouseClick = (row: number, column: number) => {
    highlighted?.onColumnChosen?.([row, column]);
  };

  const onFenceClick = (row: number, column: number) => {
    highlighted?.onFenceChosen?.([row, column]);
  };

  return (
    <div>
      <h1 className="text-xl font-bold p-2 truncate">{`${viewedPlayerState.playerId}'s City: ${viewedPlayerState.cityName}`}</h1>
      <UserNeighborhood
        config={ROW_ONE}
        houses={viewedPlayerState.housesRowOne}
        fences={viewedPlayerState.fencesRowOne}
        highlightedColumns={highlighted?.highlightedColumns?.[0]}
        highlightedFences={highlighted?.highlightedFences?.[0]}
        mini={false}
        onHouseClick={(column) => onHouseClick(0, column)}
        onFenceClick={(column) => onFenceClick(0, column)}
        pendingHouses={highlighted?.pendingHouses?.[0]}
      />
      <UserNeighborhood
        config={ROW_TWO}
        houses={viewedPlayerState.housesRowTwo}
        fences={viewedPlayerState.fencesRowTwo}
        highlightedColumns={highlighted?.highlightedColumns?.[1]}
        highlightedFences={highlighted?.highlightedFences?.[1]}
        mini={false}
        onHouseClick={(column) => onHouseClick(1, column)}
        onFenceClick={(column) => onFenceClick(1, column)}
        pendingHouses={highlighted?.pendingHouses?.[1]}
      />
      <UserNeighborhood
        config={ROW_THREE}
        houses={viewedPlayerState.housesRowThree}
        fences={viewedPlayerState.fencesRowThree}
        highlightedColumns={highlighted?.highlightedColumns?.[2]}
        highlightedFences={highlighted?.highlightedFences?.[2]}
        mini={false}
        onHouseClick={(column) => onHouseClick(2, column)}
        onFenceClick={(column) => onFenceClick(2, column)}
        pendingHouses={highlighted?.pendingHouses?.[2]}
      />
    </div>
  );
}

export function MiniUserCity({ playerId }: { playerId: string }) {
  const { playerStates } = useGameStateMachineContext();
  const viewedPlayerState = playerStates[playerId];
  return (
    <div className="max-w-xs">
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
