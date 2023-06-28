import NewGame from "./NewGame";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full h-screen flex flex-col items-center">
        <h1 className="m-8 italic text-5xl text-center">Welcome to Your Perfect Home</h1>
        <NewGame />
      </div>
      <div className="w-full text-center py-4 bottom-0 bg-gray-400 text-white">
        Made by <a href="https://alec-lee.com">Alec</a> and Liz
      </div>
    </div>
  );
}
