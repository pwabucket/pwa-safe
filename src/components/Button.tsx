import { useRef } from "react";

import Borders from "./Borders";
import useButtonClick from "../hooks/useButtonClick";
import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";

const Button: DynamicComponent<
  "button",
  { variant?: "primary" | "danger"; borders?: boolean }
> = ({ as, variant = "primary", borders = true, ...props }) => {
  const Component = as || "button";
  const ref = useRef<HTMLElement | null>(null);

  useButtonClick(ref);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn(
        "cursor-pointer outline-none",
        "relative px-4 py-2",
        "disabled:opacity-50",
        {
          primary: ["bg-green-500 text-black"],
          danger: ["bg-red-400 text-black"],
        }[variant],
        props.className
      )}
    >
      {borders && (
        <Borders
          className={cn(
            {
              primary: "border-green-500",
              danger: "border-red-500",
            }[variant]
          )}
        />
      )}
      {props.children}
    </Component>
  );
};

export default Button;
