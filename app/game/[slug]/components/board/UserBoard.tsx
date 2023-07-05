import { UserCity } from "./UserCity";
import { UserScoreSheet } from "../UserScoreSheet";
import { CityPlans } from "./CityPlans";

interface Props {
  viewedPlayerId: string;
}

export function UserBoard({ viewedPlayerId }: Props) {
  return (
    <div className="bg-orange-100 inline-block p-2 rounded-lg drop-shadow-sm min-w-fit">
      <div className="flex">
        <div className="pr-4 border-r border-gray-500">
          <UserCity viewedPlayerId={viewedPlayerId} />
        </div>
        <div className="pl-4">
          <CityPlans />
        </div>
      </div>
      <div className="border-t pt-2 border-gray-500">
        <UserScoreSheet playerId={viewedPlayerId} />
      </div>
    </div>
  );
}
