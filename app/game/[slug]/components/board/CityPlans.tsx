import { PlanCard } from "@/app/util/cardTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "../../GameStateMachineContext";

function Requirement({ size, quantity }: { size: number; quantity: number }) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    cells.push(<div className="bg-white w-3 h-3 border border-gray-500" key={i} />);
  }

  return (
    <div aria-description={`${quantity} neighborhoods of size ${size}`} className="flex flex-col items-start mb-2">
      <div aria-hidden className="text-xs">
        {quantity}x
      </div>
      <div aria-hidden className="flex flex-row items-center">
        {cells}
      </div>
    </div>
  );
}

type CompletionState = "incomplete" | "completeFirst" | "completeSecond";

interface CityPlanProps {
  plan: PlanCard;
  state: CompletionState;
}

function CityPlan({ plan, state }: CityPlanProps) {
  let first;
  switch (state) {
    case "incomplete":
      first = plan.firstValue;
      break;
    case "completeFirst":
      first = "\u2713";
      break;
    case "completeSecond":
      first = "x";
  }

  return (
    <div className="m-1 flex flex-col justify-center items-start p-1 rounded-md text-center w-20 border border-black bg-amber-50 text-lg">
      <div className="text-red-700 font-bold">n&deg;{plan.difficulty}</div>
      <div className="flex-grow">
        {plan.requirements.map((requirement, index) => (
          <Requirement size={requirement.size} quantity={requirement.quantity} key={index} />
        ))}
      </div>
      <div className="flex items-center justify-around w-full mt-2">
        <div
          className={classNames("rounded-full w-6 h-6 flex items-center justify-center", {
            "bg-green-500 text-white": state === "completeFirst",
            "bg-red-700 text-white": state === "completeSecond",
            "bg-gray-700 text-gray-300": state === "incomplete",
          })}
        >
          {first}
        </div>
        <div className="rounded-full bg-gray-300 text-gray-700 w-6 h-6 flex items-center justify-center">
          {plan.secondValue}
        </div>
      </div>
    </div>
  );
}

export function CityPlans({ viewedPlayerId }: { viewedPlayerId: string }) {
  const { playerStates, gameState } = useGameStateMachineContext();

  const completionState: CompletionState[] = React.useMemo(() => {
    return gameState.plans.map((plan, index) => {
      if (playerStates[viewedPlayerId].completedPlans[index] === plan.firstValue) {
        // if player completed first
        return "completeFirst";
      } else {
        // if anyone has completed
        const anyCompletion = Object.keys(playerStates).reduce((accum, playerId) => {
          return accum || playerStates[playerId].completedPlans[index] > 0;
        }, false);

        return anyCompletion ? "completeSecond" : "incomplete";
      }
    });
  }, [gameState.plans, viewedPlayerId, playerStates]);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl text-center">City Plans</h1>
      <div className="flex">
        {gameState.plans.map((plan, index) => (
          <CityPlan plan={plan} state={completionState[index]} key={index} />
        ))}
      </div>
    </div>
  );
}
