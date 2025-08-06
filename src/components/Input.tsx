import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";

const Input: DynamicComponent<"input"> = ({ as, ...props }) => {
  const Component = as || "input";
  return (
    <Component
      {...props}
      className={cn(
        "p-2 text-green-100",
        "border border-green-500 focus:outline-0 focus:bg-neutral-700",
        props.className
      )}
    />
  );
};

export default Input;
