import { chooseCard } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { CancelButton } from "./CancelButton";

export function ChooseBIS({ value }: { value: number }) {
  const dispatch = useGameStateMachineDispatch();
  return (
    <div>
      <button className="px-8 py-2 mr-2 rounded-full bg-yellow-200 hover:bg-yellow-300">Skip BIS</button>
      <CancelButton />
    </div>
  );
}
