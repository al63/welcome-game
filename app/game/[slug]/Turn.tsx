import { CardState } from "@/app/util/CardTypes";
import { Cards } from "./Cards";

interface TurnProps {
  cardState: CardState;
}
export function Turn({ cardState }: TurnProps) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Turn 1</h1>
      <p>Choose a card to play</p>
      <div className="mt-2">
        <Cards cardState={cardState} />
      </div>
    </div>
  );
}
