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

        "autofill:bg-clip-text autofill:caret-green-500",
        "autofill:inset-ring-30 autofill:inset-ring-neutral-700",
        "autofill:[-webkit-text-fill-color:var(--color-green-500)]",
        props.className,
      )}
    />
  );
};

export default Input;
