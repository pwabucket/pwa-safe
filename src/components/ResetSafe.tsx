import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";

import Button from "./Button";
import DialogContainer from "./DialogContainer";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import { cn } from "../lib/utils";

const ResetSafe = ({
  dialogManager,
}: {
  dialogManager: ReturnType<typeof useDialogManager>;
}) => {
  const clearEntries = useAppStore((state) => state.clearEntries);
  const resetAccessCode = useAppStore((state) => state.resetAccessCode);

  const handleReset = async () => {
    dialogManager.startProcessing();
    await safe.clearEntries();
    clearEntries();
    resetAccessCode();
    dialogManager.stopProcessing();
    dialogManager.markAsSuccess();
  };

  return (
    <Dialog.Root
      open={dialogManager.isDialogVisible}
      onOpenChange={dialogManager.hideDialog}
    >
      <DialogContainer onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title className="text-xs uppercase text-green-300">
          Void Sequence
        </Dialog.Title>
        <Dialog.Description
          className={cn(
            "text-yellow-100",
            dialogManager.isProcessing || dialogManager.isSuccess
              ? "sr-only"
              : ""
          )}
        >
          Initiating Safe reset. All entries and access codes will be
          permanently erased.
        </Dialog.Description>

        {dialogManager.isProcessing ? (
          <p className="text-green-100">Processing...</p>
        ) : dialogManager.isSuccess ? (
          <p className="text-green-100">
            <ReactTyped
              typeSpeed={20}
              strings={[
                "Safe reset complete.",
                "All entries and access codes have been erased.",
              ]}
              onComplete={() =>
                new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
                  dialogManager.resetDialogState();
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
