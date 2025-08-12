import TextareaAutosize from "react-textarea-autosize";

import { cn } from "../lib/utils";

const Textarea = (
  props: React.ComponentPropsWithoutRef<typeof TextareaAutosize>
) => {
  return (
    <TextareaAutosize
      {...props}
      className={cn(
        "p-2 text-green-100",
        "border border-green-500 focus:outline-0 focus:bg-neutral-700",
        props.className
      )}
    />
  );
};

export default Textarea;
