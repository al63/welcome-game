import React from "react";
import { pickShouldReshuffle } from "../../GameStateMachineActions";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";

export function ReshuffleOptions() {
  const dispatch = useGameStateMachineDispatch();

  const onClick = React.useCallback(
    (reshuffle: boolean) => {
      dispatch(pickShouldReshuffle(reshuffle));
    },
    [dispatch]
  );

  return (
    <div className="flex gap-4">
      <button className="px-8 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={() => onClick(true)}>
        Yes
      </button>
      <button className="px-8 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300" onClick={() => onClick(false)}>
        No
      </button>
    </div>
  );
}
