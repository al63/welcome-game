import React from "react";
import { useGameStateMachineDispatch } from "./GameStateMachineContext";
import { chooseTempAgencyModifier } from "./GameStateMachineActions";

export function TempAgencyModifier({ value }: { value: number }) {
  const dispatch = useGameStateMachineDispatch();

  const options = React.useMemo(() => {
    const res: React.ReactNode[] = [];
    for (let i = value - 2; i <= value + 2; i++) {
      if (i >= 0 && i <= 17) {
        res.push(
          <div
            onClick={() => dispatch(chooseTempAgencyModifier(i))}
            className="text-2xl px-2 mr-1 rounded-lg bg-orange-300 hover:bg-orange-400 cursor-pointer"
          >
            {i}
          </div>
        );
      }
    }

    return res;
  }, [dispatch, value]);

  return <div className="flex">{options}</div>;
}
