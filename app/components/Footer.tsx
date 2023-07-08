import Image from "next/image";

export function Footer() {
  return (
    <div className="fixed w-full text-center py-4 bottom-0 bg-gray-500 text-white text-lg flex justify-center items-center">
      <p>
        Made by <Image className="mr-2 inline" height="22" width="22" src="/bubcation.png" alt="Vacation Bub" />
        Alec and Liz
        <Image className="ml-2 inline" height="22" width="22" src="/bobcation.png" alt="Vacation Bob" />
      </p>
      <a href="https://github.com/al63/welcome-game" target="_blank" rel="noreferrer">
        <Image className="ml-2" height="22" width="22" src="/github-mark-white.svg" alt="Github source" />
      </a>
    </div>
  );
}
