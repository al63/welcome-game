import { GameCardType } from "@/app/util/CardTypes";
import React from "react";

interface NumberCardProps {
  value: number | null;
  backingModifier: GameCardType;
  type: "number";
}

interface ModifierCardProps {
  modifier: GameCardType;
  type: "modifier";
}

type CardProps = NumberCardProps | ModifierCardProps;

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
    case "GARDEN":
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
      return "Estate";
    case "BIS":
      return "BIS";
    case "TEMP":
      return "Temp";
    case "GARDEN":
      return "Garden";
  }
}

export function Card(props: CardProps) {
  let content;
  if (props.type === "number") {
    content = (
      <>
        <h1 className="text-2xl">{props.value}</h1>
        <div
          className={`m-1 absolute top-0 right-0 rounded-sm w-3 h-3 border border-black ${modifierColor(
            props.backingModifier
          )}`}
        />
        <div
          className={`m-1 absolute bottom-0 left-0 rounded-sm w-3 h-3 border border-black ${modifierColor(
            props.backingModifier
          )}`}
        />
      </>
    );
  } else {
    content = (
      <div className="flex flex-col justify-center items-center text-sm">
        <div className={`m-1 rounded-sm w-6 h-6 border border-black ${modifierColor(props.modifier)}`} />
        {modifierDisplayName(props.modifier)}
      </div>
    );
  }

  return (
    <div className="flex relative justify-center items-center m-1 rounded-md text-center w-16 h-24 border border-black bg-amber-50 text-lg">
      {content}
    </div>
  );
}
