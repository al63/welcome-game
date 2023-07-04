import { PlayerStates } from "@/app/util/PlayerTypes";
import { UserCity } from "./UserCity";
import { UserScoreSheet } from "./UserScoreSheet";
import { CityPlans } from "./CityPlans";
import { PlanCard } from "@/app/util/CardTypes";

interface Props {
  playerStates: PlayerStates;
  playerId: string;
  viewedPlayerId: string;
  plans: Array<PlanCard>;
}

export function UserBoard({ playerStates, playerId, viewedPlayerId, plans }: Props) {
  const playerState = playerStates[viewedPlayerId];
  return (
    <div className="bg-orange-100 inline-block p-2 rounded-lg drop-shadow-sm min-w-fit">
      <div className="flex">
        <div className="pr-4 border-r border-gray-500">
          <UserCity playerState={playerState} />
        </div>
        <div className="pl-4">
          <CityPlans playerStates={playerStates} plans={plans} />
        </div>
      </div>
      <div className="border-t pt-2 border-gray-500">
        <UserScoreSheet playerStates={playerStates} playerId={viewedPlayerId} />
      </div>
    </div>
  );
}
