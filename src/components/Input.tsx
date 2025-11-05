import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";

const Input: DynamicComponent<"input"> = ({ as, ...props }) => {
  const Component = as || "input";
  return (
    <Component
      {...props}
      className={cn(
        "p-2 font-bold text-green-500 placeholder:text-neutral-500",
        "bg-neutral-700 focus:outline-none",
        "disabled:opacity-50",
        props.className
      )}
    />
  );
};

export default Input;
