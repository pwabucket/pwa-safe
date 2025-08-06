import { useRef } from "react";

import useButtonClick from "../hooks/useButtonClick";
import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";

const Button: DynamicComponent<"button"> = ({ as, ...props }) => {
  const Component = as || "button";
  const ref = useRef<HTMLElement | null>(null);

  useButtonClick(ref);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn(
        "cursor-pointer outline-none",
        "relative border border-green-500 px-4 py-2 text-green-300",
        "bg-green-500/5 hover:bg-green-500/10 focus:bg-green-500/10",
        props.className
      )}
    >
      <span className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-green-500" />
      <span className="absolute top-0 right-0 size-3 border-t-2 border-r-2 border-green-500" />
      <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-green-500" />
      <span className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-green-500" />
      {props.children}
    </Component>
  );
};

export default Button;
