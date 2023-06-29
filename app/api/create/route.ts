import { NextResponse } from "next/server";

import seedrandom from "seedrandom";

// Move later, but need a way to be able to deterministically shuffle the deck and draw from it .
// Can just create random seed at game start time, store it + number cards drawn, and re-shuffle deck whenever we draw new cards.
function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  const rng = seedrandom(seed);
  const seedRand = (func: seedrandom.PRNG, min: number, max: number) => {
    return Math.floor(func() * (max - min + 1)) + min;
  };
  const resp: T[] = [];
  const keys = Object.keys(Array.from(new Array(arr.length)));

  for (let i = 0; i < arr.length; i++) {
    const r = seedRand(rng, 0, keys.length - 1);
    const g = keys[r];
    keys.splice(r, 1);
    resp.push(arr[Number(g)]);
  }

  return resp;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arr = shuffleWithSeed([1, 2, 3, 4, 5], searchParams.get("seed") ?? "lol");
  return NextResponse.json({ hello: arr });
}
