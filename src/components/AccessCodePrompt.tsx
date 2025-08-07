import { Dialog } from "radix-ui";
import { HiOutlineXMark } from "react-icons/hi2";

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
            <Dialog.Title>Access Code</Dialog.Title>
            <Dialog.Description className="text-sm text-green-100">
              Enter an access code to {mode} your content.
            </Dialog.Description>
          </div>

          <Dialog.Close className="text-green-200 p-2 bg-neutral-700 cursor-pointer">
            <HiOutlineXMark className="size-5" />
          </Dialog.Close>
        </div>

        <Button onClick={() => onAccessCode(accessCode as string)}>
          Use Current
        </Button>
        <AccessCodeInput onFilled={(code) => onAccessCode(code)} />
      </DialogContainer>
    </Dialog.Root>
  );
}
