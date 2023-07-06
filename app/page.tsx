import { Footer } from "./components/Footer";
import NewGame from "./components/NewGame";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full p-4 flex flex-col items-center pb-20">
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
      <Footer />
    </div>
  );
}
