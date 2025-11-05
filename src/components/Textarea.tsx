import TextareaAutosize from "react-textarea-autosize";

import { cn } from "../lib/utils";

const Textarea = (
  props: React.ComponentPropsWithoutRef<typeof TextareaAutosize>
) => {
  return (
    <TextareaAutosize
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

export default Textarea;
