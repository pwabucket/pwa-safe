import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";

import Button from "./Button";
import DialogContainer from "./DialogContainer";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";
import { useMutation } from "@tanstack/react-query";

const ResetSafe = ({ open, onOpenChange }: Dialog.DialogProps) => {
  const clearEntries = useAppStore((state) => state.clearEntries);
  const resetAccessCode = useAppStore((state) => state.resetAccessCode);

  const mutation = useMutation({
    mutationKey: ["reset-safe"],
    mutationFn: async () => {
      await safe.clearEntries();
      clearEntries();
      resetAccessCode();
    },
  });

  const handleReset = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContainer onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title className="text-xs uppercase text-green-300">
          Void Sequence
        </Dialog.Title>
        <Dialog.Description
          className={cn(
            "text-yellow-100",
            mutation.isPending || mutation.isSuccess ? "sr-only" : ""
          )}
        >
          Initiating Safe reset. All entries and access codes will be
          permanently erased.
        </Dialog.Description>

        {mutation.isPending ? (
          <p className="text-green-100">Processing...</p>
        ) : mutation.isSuccess ? (
          <p className="text-green-100">
            <ReactTyped
              typeSpeed={20}
              strings={[
                "Safe reset complete.",
                "All entries and access codes have been erased.",
              ]}
              onComplete={() =>
                new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
                  onOpenChange?.(false);
                })
              }
            />
          </p>
        ) : (
          <>
            <Button variant="danger" className="my-2" onClick={handleReset}>
              Proceed
            </Button>

            <Dialog.Close className="cursor-pointer">Abort</Dialog.Close>
          </>
        )}
      </DialogContainer>
    </Dialog.Root>
  );
};

export default ResetSafe;
