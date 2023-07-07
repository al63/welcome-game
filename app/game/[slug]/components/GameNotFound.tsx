import Link from "next/link";

export function GameNotFound() {
  return (
    <div className="m-2 text-center">
      <h1 className="m-8 italic text-5xl text-center">Welcome to Your Perfect Home</h1>
      <p className="text-md">
        Game / Player combination not found. Double check the game link shared to you, or{" "}
        <Link className="text-blue-500 underline" href="/" prefetch={false}>
          create
        </Link>{" "}
        a new game.
      </p>
    </div>
  );
}
