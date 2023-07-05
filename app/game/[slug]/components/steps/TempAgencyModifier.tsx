import React from "react";
import { useGameStateMachineDispatch } from "../../GameStateMachineContext";
import { chooseTempAgencyModifier } from "../../GameStateMachineActions";
import { CancelButton } from "./CancelButton";

export function TempAgencyModifier({ value }: { value: number }) {
  const dispatch = useGameStateMachineDispatch();

  const options = React.useMemo(() => {
    const res: React.ReactNode[] = [];
    for (let i = value - 2; i <= value + 2; i++) {
      if (i >= 0 && i <= 17) {
        res.push(
          <button
            onClick={() => dispatch(chooseTempAgencyModifier(i))}
            className="text-2xl px-2 mr-1 rounded-lg bg-orange-300 hover:bg-orange-400 cursor-pointer"
          >
            {i}
          </button>
        );
      }
    }

    return res;
  }, [dispatch, value]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex mb-2">{options}</div>
      <CancelButton />
    </div>
  );
}
