import { PlanCard } from "@/app/util/CardTypes";
import classNames from "classnames";
import React from "react";
import { useGameStateMachineContext } from "../../GameStateMachineContext";

function Requirement({ size, quantity }: { size: number; quantity: number }) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    cells.push(<div className="bg-white w-2 h-2 border border-gray-500" key={i} />);
  }

  return (
    <div className="flex flex-row items-center">
      {cells}
      <div className="text-xs ml-1">x{quantity}</div>
    </div>
  );
}

interface CityPlanProps {
  plan: PlanCard;
  completed: boolean;
}

function CityPlan({ plan, completed }: CityPlanProps) {
  return (
    <div className="m-1 flex flex-col justify-center items-start p-1 rounded-md text-center w-20 h-32 border border-black bg-amber-50 text-lg">
      <div className="text-red-700 font-bold">n&deg;{plan.difficulty}</div>
      <div className="flex-grow">
        {plan.requirements.map((requirement, index) => (
          <Requirement size={requirement.size} quantity={requirement.quantity} key={index} />
        ))}
      </div>
      <div className="flex items-center justify-around w-full">
        <div
          className={classNames("rounded-full w-6 h-6 flex items-center justify-center", {
            "bg-red-700 text-white": completed,
            "bg-gray-700 text-gray-300": !completed,
          })}
        >
          {completed ? "\u2713" : plan.firstValue}
        </div>
        <div className="rounded-full bg-gray-300 text-gray-700 w-6 h-6 flex items-center justify-center">
          {plan.secondValue}
        </div>
      </div>
    </div>
  );
}

export function CityPlans() {
  const { playerStates, gameState } = useGameStateMachineContext();

  // convert player states completed plans to booleans for if a plan has been completed at all
  const completedPlans = React.useMemo(() => {
    return Object.keys(playerStates).reduce<boolean[]>(
      (accum, playerId) => {
        return playerStates[playerId].completedPlans
          .map((plan) => plan > 0) // convert to bools
          .map((completed, index) => completed || accum[index]); // combine with other players
      },
      [false, false, false]
    );
  }, [playerStates]);

  return (
    <div className="flex flex-col">
      <h1 className="text-xl text-center">City Plans</h1>
      <div className="flex flex-grow self-center">
        {gameState.plans.map((plan, index) => (
          <CityPlan plan={plan} completed={completedPlans[index]} key={index} />
        ))}
      </div>
    </div>
  );
}
