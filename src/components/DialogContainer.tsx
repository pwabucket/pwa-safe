import { Dialog } from "radix-ui";

import { cn } from "../lib/utils";

export default function DialogContainer(
  props: React.ComponentProps<typeof Dialog.Root>
) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Overlay className="fixed inset-0 bg-black/70 p-6 grid place-items-center">
        <Dialog.Content
          className={cn(
            "flex gap-2 p-4",
            "border border-green-600 bg-green-900 text-green-200",
            "w-full max-w-sm"
          )}
        >
          {props.children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Root>
  );
}
