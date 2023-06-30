import { Neighborhood } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";

function House({ house }: { house: House }) {
  return (
    <div className="flex flex-col text-xs items-center">
      <div>{house.value}</div>
      <div>{house.modifier}</div>
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
  if (config.houses !== houses.length) {
    return null;
  }

  return (
    <div className="border flex m-2 self-end">
      {houses.map((house, index) => {
        return <Cell key={index} house={house} pool={config.pools.includes(index)} />;
      })}
    </div>
  );
}
