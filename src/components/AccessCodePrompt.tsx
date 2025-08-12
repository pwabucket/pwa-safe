import { Dialog } from "radix-ui";
import { HiOutlineXMark } from "react-icons/hi2";
import { ReactTyped } from "react-typed";

import AccessCodeInput from "./AccessCodeInput";
import Button from "./Button";
import DialogContainer from "./DialogContainer";
import useAccessCode from "../hooks/useAccessCode";
import type useDialogManager from "../hooks/useDialogManager";

export default function AccessCodePrompt({
  dialogManager,
  mode,
  onAccessCode,
}: {
  dialogManager: ReturnType<typeof useDialogManager>;
  mode: "encrypt" | "decrypt";
  onAccessCode: (code: string) => void;
}) {
  const accessCode = useAccessCode();
  const hasResult = dialogManager.isSuccess || dialogManager.isError;
  const processingDescription =
    mode === "encrypt"
      ? "Encrypting your content..."
      : "Decrypting your content...";

  const dialogTitle =
    hasResult || dialogManager.isProcessing ? "Agent Log" : "Access Code";

  const dialogDescription = hasResult
    ? "Status Update"
    : dialogManager.isProcessing
    ? processingDescription
    : `Enter an access code to ${mode} your content.`;

  return (
    <Dialog.Root
      open={dialogManager.isDialogVisible}
      onOpenChange={dialogManager.hideDialog}
    >
      <DialogContainer
        onInteractOutside={(e) => e.preventDefault()}
        className="bg-neutral-800"
      >
        <div className="flex gap-4 items-start">
          <div className="grow min-w-0">
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Description className="text-sm text-green-100">
              {dialogDescription}
            </Dialog.Description>
          </div>

          <Dialog.Close
            disabled={dialogManager.isProcessing}
            className="text-green-200 p-2 bg-neutral-700 cursor-pointer"
          >
            <HiOutlineXMark className="size-5" />
          </Dialog.Close>
        </div>

        {hasResult ? (
          <ReactTyped
            className={
              dialogManager.isSuccess ? "text-green-100" : "text-red-100"
            }
            typeSpeed={20}
            strings={
              dialogManager.isSuccess
                ? ["Operation Successful!"]
                : ["Operation Failed!"]
            }
            onComplete={() =>
              new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                dialogManager.isSuccess
                  ? dialogManager.resetDialogState()
                  : dialogManager.resetStatus()
              )
            }
          />
        ) : !dialogManager.isProcessing ? (
          <>
            <Button onClick={() => onAccessCode(accessCode as string)}>
              Use Current
            </Button>
            <AccessCodeInput onFilled={(code) => onAccessCode(code)} />
          </>
        ) : null}
      </DialogContainer>
    </Dialog.Root>
  );
}
