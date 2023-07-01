import { PlayerState } from "@/app/util/PlayerTypes";

function Plans() {
  return (
    <div className="bg-blue-300 p-2 m-2 flex flex-col items-center rounded-md">
      <h1>Plans</h1>

      <div>n1</div>
      <div>n2</div>
      <div>n3</div>
    </div>
  );
}

export function UserScoreSheet({ playerState }: { playerState: PlayerState }) {
  return (
    <div className="flex">
      <Plans />
      <Plans />
      <Plans />
    </div>
  );
}
