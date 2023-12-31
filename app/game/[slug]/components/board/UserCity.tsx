import { Neighborhood, ROW_ONE, ROW_THREE, ROW_TWO } from "@/app/util/neighborhoods";
import { House } from "@/app/util/playerTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "../../GameStateMachineContext";
import { PendingInfo, useHighlightedLocations } from "../../useHighlightedLocations";
import { PreviousPlacementColumn, usePreviousPlacements } from "../../usePreviousPlacements";

interface ParksProgressProps {
  scores: number[];
  count: number;
}

const ParksProgress = React.memo(function ParksProgress({ scores, count }: ParksProgressProps) {
  return (
    <div aria-description="Points for parks" className="flex">
      {scores.map((score, index) => {
        return (
          <div
            className={classNames("m-1 rounded-full text-center w-6", {
              "bg-green-600 font-bold": count === index,
              "bg-green-300": count < index,
              "bg-green-300 line-through text-gray-400": index < count,
            })}
            key={index}
            aria-checked={count === index}
          >
            {score}
          </div>
        );
      })}
    </div>
  );
});

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
  highlighted: boolean;
  pool?: boolean;
  onClick?: () => void;
  pendingHouse?: PendingInfo;
  previouslyPlaced?: PreviousPlacementColumn;
}

const Cell = React.memo(function Cell({
  house,
  pool,
  mini,
  highlighted,
  onClick,
  pendingHouse,
  previouslyPlaced,
}: CellProps) {
  const renderedHouse = house || pendingHouse?.house;
  const occupied = renderedHouse != null;

  let bgColor = "bg-white";
  if (previouslyPlaced != null) {
    switch (previouslyPlaced.modifier) {
      case "BIS":
        bgColor = "bg-red-200";
        break;
      case "ESTATE":
        bgColor = "bg-purple-200";
        break;
      case "PARK":
        bgColor = "bg-green-200";
        break;
      case "POOL":
        bgColor = "bg-blue-200";
        break;
      case "TEMP":
        bgColor = "bg-orange-200";
        break;
      case "FENCE":
      default:
        bgColor = "bg-gray-300";
        break;
    }
  } else if (highlighted) {
    bgColor = "bg-green-300 hover:bg-green-400 cursor-pointer";
  } else if (occupied) {
    bgColor = "bg-gray-100";
  }

  const className = classNames("border relative flex justify-center items-center", {
    [bgColor]: true,
    "border-t-black border-t-2": house?.usedForPlan,
    "w-6 h-6": mini,
    "w-12 h-12": !mini,
  });

  const children = (
    <>
      {pool && !mini ? (
        <div aria-label="Pool Location" className="bg-blue-500 w-2 h-2 top-1 right-1.5 absolute" />
      ) : null}
      {renderedHouse != null ? <House house={renderedHouse} showModifiers={!mini} /> : null}
    </>
  );

  return onClick != null ? (
    <button role="gridcell" aria-label="Place house" className={className} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div role="gridcell" aria-label="House" className={className}>
      {children}
    </div>
  );
});

interface FenceProps {
  mini: boolean;
  active: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  previouslyPlaced?: boolean;
}

const Fence = React.memo(function Fence({ mini, active, highlighted, onClick, previouslyPlaced }: FenceProps) {
  return (
    <div
      aria-label={active ? "Active fence" : "Inactive fence"}
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
      {previouslyPlaced && !highlighted ? <div className="absolute h-6 z-10 w-1 -left-0.5 bg-gray-500" /> : null}
      {highlighted ? (
        <button
          aria-label="Place fence"
          className="absolute h-12 w-3 -left-1.5 z-10 bg-green-300 hover:bg-green-400 cursor-pointer"
          onClick={onClick}
        />
      ) : null}
    </div>
  );
});

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
  prevHouses?: Array<PreviousPlacementColumn>;
  prevFences?: Set<number>;
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
  prevHouses,
  prevFences,
}: RowProps) {
  const numParks = React.useMemo(() => {
    return houses.filter((house) => house?.modifier === "PARK").length;
  }, [houses]);

  if (config.houses !== houses.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-end">
      {mini ? null : <ParksProgress scores={config.parkScores} count={numParks} />}
      <div className="flex mb-2">
        <Fence active mini={mini} />
        {houses.map((house, index) => {
          const fenceAfter = index < fences.length && fences[index];
          const highlighted = highlightedColumns?.has(index);
          const highlightedFence = highlightedFences?.has(index);
          const pendingHouse = pendingHouses?.find((pending) => pending.column === index);

          const previouslyPlaced = prevHouses?.find((house) => house.column === index);

          return (
            <div role="row" className="flex" key={index}>
              <Cell
                house={house}
                pool={config.pools.includes(index)}
                mini={mini}
                highlighted={highlighted ?? false}
                onClick={highlighted ? () => onHouseClick?.(index) : undefined}
                pendingHouse={pendingHouse}
                previouslyPlaced={previouslyPlaced}
              />
              {index < houses.length - 1 ? (
                <Fence
                  active={fenceAfter}
                  mini={mini}
                  highlighted={highlightedFence}
                  onClick={highlightedFence ? () => onFenceClick?.(index) : undefined}
                  previouslyPlaced={prevFences?.has(index)}
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
      <h1
        role="grid"
        className="text-xl font-bold p-2 truncate"
      >{`${viewedPlayerState.playerId}'s City: ${viewedPlayerState.cityName}`}</h1>
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
  const previousPlacements = usePreviousPlacements(playerId);
  const viewedPlayerState = playerStates[playerId];
  return (
    <div className="max-w-xs">
      <h1 className="text-lg font-bold pb-2 truncate text-center">{viewedPlayerState.cityName}</h1>
      <UserNeighborhood
        config={ROW_ONE}
        houses={viewedPlayerState.housesRowOne}
        fences={viewedPlayerState.fencesRowOne}
        prevHouses={previousPlacements?.houses[0]}
        prevFences={previousPlacements?.fences[0]}
        mini
      />
      <UserNeighborhood
        config={ROW_TWO}
        houses={viewedPlayerState.housesRowTwo}
        fences={viewedPlayerState.fencesRowTwo}
        prevHouses={previousPlacements?.houses[1]}
        prevFences={previousPlacements?.fences[1]}
        mini
      />
      <UserNeighborhood
        config={ROW_THREE}
        houses={viewedPlayerState.housesRowThree}
        fences={viewedPlayerState.fencesRowThree}
        prevHouses={previousPlacements?.houses[2]}
        prevFences={previousPlacements?.fences[2]}
        mini
      />
    </div>
  );
}
