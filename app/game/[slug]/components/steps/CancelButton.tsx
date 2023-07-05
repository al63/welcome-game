import { cancelAction } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";

export function CancelButton() {
  const dispatch = useGameStateMachineDispatch();
  return (
    <button className="px-8 py-2 rounded-full bg-red-200 hover:bg-red-300" onClick={() => dispatch(cancelAction())}>
      Cancel
    </button>
  );
}
