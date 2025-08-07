import { Dialog } from "radix-ui";

import { cn } from "../lib/utils";

export default function DialogContainer(
  props: React.ComponentProps<typeof Dialog.Content>
) {
  return (
    <>
      <Dialog.Overlay className="fixed inset-0 bg-black/70 p-6 grid place-items-center">
        <Dialog.Content
          {...props}
          className={cn(
            "relative",
            "flex flex-col gap-2 p-4",
            "border border-green-600 bg-green-900 text-green-200",
            "w-full max-w-sm",
            props.className
          )}
        />
      </Dialog.Overlay>
    </>
  );
}
