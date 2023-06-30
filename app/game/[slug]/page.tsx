import { UserBoard } from "./UserBoard";

const dummy = {
  playerId: "bob",
  gameId: "bub",
  score: 12,
  housesRowOne: new Array(10).fill(null),
  housesRowTwo: new Array(11).fill(null),
  housesRowThree: new Array(12).fill(null),
  fencesRowOne: new Array(9).fill(false),
  fencesRowTwo: new Array(10).fill(false),
  fencesRowThree: new Array(11).fill(false),
  completedPlans: [false, false, false],
  estateModifiers: new Array(6).fill(0),
  permitRefusals: 0,
};

export default function Game({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full">
      <UserBoard playerState={dummy} />
    </div>
  );
}
