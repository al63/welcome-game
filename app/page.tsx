import NewGame from "./NewGame";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full min-h-screen p-4 flex flex-col items-center">
        <h1 className="m-8 italic text-5xl text-center">Welcome to Your Perfect Home</h1>
        <p className="mb-2">
          A web version of the <span className="italic">Welcome To...</span> board game. Learn how to play the game{" "}
          <a
            className="text-blue-500 underline"
            href="https://www.ultraboardgames.com/welcome-to/game-rules.php"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
        <NewGame />
      </div>
      <div className="w-full text-center py-4 bottom-0 bg-gray-400 text-white">
        Made by{" "}
        <a className="underline" href="https://alec-lee.com">
          Alec
        </a>{" "}
        and Liz
      </div>
    </div>
  );
}
