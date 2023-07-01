import { NextResponse } from "next/server";

import Srand from "seeded-rand";

export async function GET(request: Request) {
  const test = new Srand(new Date().getMilliseconds());
  const res = test.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  return NextResponse.json({ hello: res });
}
