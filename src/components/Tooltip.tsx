import type { ReactNode } from "react";

export default function Tooltip({
  text,
  children
}: {
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative group inline-block">

      {children}

      <div className="
        absolute top-full left-1/2 -translate-x-1/2 mt-2
        px-2 py-1
        text-xs text-white
        bg-black/80
        rounded-md
        opacity-0 group-hover:opacity-100
        transition
        whitespace-nowrap
        z-50
      ">
        {text}
      </div>

    </div>
  );
}