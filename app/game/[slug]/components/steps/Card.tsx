import { GameCardType } from "@/app/util/CardTypes";
import React from "react";

function modifierColor(modifier: GameCardType): string {
  switch (modifier) {
    case "POOL":
      return "bg-sky-400";
    case "FENCE":
      return "bg-white";
    case "ESTATE":
      return "bg-violet-400";
    case "BIS":
      return "bg-rose-400";
    case "TEMP":
      return "bg-orange-400";
    case "PARK":
      return "bg-green-600";
  }
}

export function modifierDisplayName(modifier: GameCardType): string {
  switch (modifier) {
    case "POOL":
      return "Pool";
    case "FENCE":
      return "Fence";
    case "ESTATE":
      return "Real Estate";
    case "BIS":
      return "BIS";
    case "TEMP":
      return "Temp Agency";
    case "PARK":
      return "Park";
  }
}

interface CardProps {
  value: number;
  modifier: GameCardType;
  onClick: () => void;
}

export function Card({ value, modifier, onClick }: CardProps) {
  return (
    <div
      className="flex relative justify-center items-center m-1 rounded-md text-center w-20 h-28 border border-black bg-amber-50 text-lg cursor-pointer hover:bg-amber-100"
      onClick={onClick}
    >
      <div className="flex flex-col justify-center items-center text-sm">
        <p className="text-xl">{value}</p>
        {modifierDisplayName(modifier)}
        <div className={`m-1 rounded-sm w-6 h-6 border border-black ${modifierColor(modifier)}`} />
      </div>
    </div>
  );
}
