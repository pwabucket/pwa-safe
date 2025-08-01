import { cn } from "../lib/utils";

const Input = (
  props: { className?: string } & React.ComponentPropsWithoutRef<"input">
) => {
  return (
    <input
      {...props}
      className={cn(
        "p-2 bg-neutral-700 text-white border border-transparent focus:outline-0 focus:border-green-500",
        props.className
      )}
    />
  );
};

export default Input;
