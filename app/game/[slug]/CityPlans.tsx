import { PlanCard } from "@/app/util/CardTypes";

function Requirement({ size, quantity }: { size: number; quantity: number }) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    cells.push(<div className="bg-white w-2 h-2 border border-gray-500" />);
  }

  return (
    <div className="flex flex-row items-center">
      {cells}
      <div className="text-xs ml-1">x{quantity}</div>
    </div>
  );
}

function CityPlan({ plan }: { plan: PlanCard }) {
  return (
    <div className="m-1 flex flex-col justify-center items-start p-1 rounded-md text-center w-20 h-28 border border-black bg-amber-50 text-lg">
      <div className="text-red-700 font-bold">n&deg;{plan.difficulty}</div>
      <div className="flex-grow">
        {plan.requirements.map((requirement, index) => (
          <Requirement size={requirement.size} quantity={requirement.quantity} key={index} />
        ))}
      </div>
      <div className="flex items-center justify-around w-full">
        <div className="rounded-full bg-gray-700 text-gray-300 w-6 h-6 flex items-center justify-center">
          {plan.firstValue}
        </div>
        <div className="rounded-full bg-gray-300 text-gray-700 w-6 h-6 flex items-center justify-center">
          {plan.secondValue}
        </div>
      </div>
    </div>
  );
}

interface CityPlansProps {
  plans: Array<PlanCard>;
}

export function CityPlans({ plans }: CityPlansProps) {
  return (
    <div>
      <h1 className="text-xl">City Plans</h1>
      <div className="flex">
        {plans.map((plan, index) => (
          <CityPlan plan={plan} key={index} />
        ))}
      </div>
    </div>
  );
}
