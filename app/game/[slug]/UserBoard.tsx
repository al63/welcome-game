import { ROW_ONE, ROW_TWO, ROW_THREE } from "@/app/util/Neighborhoods";
import { PlayerState } from "@/app/util/PlayerTypes";
import { UserNeighborhood } from "./UserNeighborhood";
import { UserScoreSheet } from "./UserScoreSheet";

interface Props {
  playerState: PlayerState;
}

export function UserBoard({ playerState }: Props) {
  return (
    <div>
      <div className="flex">
        <div className="flex flex-col grow">
          <UserNeighborhood config={ROW_ONE} houses={playerState.housesRowOne} fences={playerState.fencesRowOne} />
          <UserNeighborhood config={ROW_TWO} houses={playerState.housesRowTwo} fences={playerState.fencesRowTwo} />
          <UserNeighborhood
            config={ROW_THREE}
            houses={playerState.housesRowThree}
            fences={playerState.fencesRowThree}
          />
        </div>
        <div className="mx-4">CARDS TO DRAW</div>
      </div>
      <UserScoreSheet />
    </div>
  );
}
