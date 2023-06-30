import { Neighborhood } from "@/app/util/Neighborhoods";
import { House } from "@/app/util/PlayerTypes";

interface Props {
  config: Neighborhood;
  houses: House[];
  fences: boolean[];
}

export function UserNeighborhood(props: Props) {
  return "neighborhood";
}
