import Image from "next/image";

export function Footer() {
  return (
    <div className="w-full text-center py-4 bottom-0 bg-gray-400 text-white text-lg flex justify-center items-center">
      <p>
        Made by{" "}
        <a className="underline" href="https://alec-lee.com" target="_blank" rel="noreferrer">
          Alec
        </a>{" "}
        and Liz.
      </p>
      <a href="https://github.com/al63/welcome-game" target="_blank" rel="noreferrer">
        <Image className="ml-2" height="22" width="22" src="/github-mark-white.svg" alt="Github source" />
      </a>
    </div>
  );
}
