import { Dialog } from "radix-ui";
import { cn } from "../lib/utils";

export default function DialogContainer(
  props: React.ComponentProps<typeof Dialog.Content>,
) {
  return (
    <>
      <Dialog.Overlay className="fixed inset-0 bg-black/70 flex flex-col z-50">
        <div className="max-w-md w-full p-4 m-auto">
          <Dialog.Content
            {...props}
            className={cn(
              "relative",
              "flex flex-col gap-2 p-4",
              "border border-green-600 bg-green-900 text-green-200",
              "min-w-0 min-h-0",
              props.className,
            )}
          />
        </div>
      </Dialog.Overlay>
    </>
  );
}
