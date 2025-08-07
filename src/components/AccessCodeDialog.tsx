import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";

import DialogContainer from "./DialogContainer";

export default function AccessCodeDialog({
  mode = "create",
  isDialogVisible,
  isProcessing,
  isInvalidAccessCode = false,
  onComplete,
}: {
  mode: "create" | "verify";
  isDialogVisible: boolean;
  isProcessing: boolean;
  isInvalidAccessCode?: boolean;
  onComplete: () => void;
}) {
  return (
    <DialogContainer open={isDialogVisible}>
      <div className="grow min-w-0">
        <Dialog.Title className="text-xs uppercase text-green-300">
          Agent Log
        </Dialog.Title>
        <Dialog.Description className="sr-only">
          Access Code {mode === "create" ? "Creation" : "Verification"}
        </Dialog.Description>

        <p
          className={
            mode === "verify" && !isProcessing && isInvalidAccessCode
              ? "text-yellow-100"
              : "text-green-100"
          }
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <ReactTyped
              typeSpeed={20}
              strings={[
                mode === "create"
                  ? "Access Code Created!"
                  : isInvalidAccessCode
                  ? "Access Code Invalid!"
                  : "Access Code Verified!",
                mode === "verify" && isInvalidAccessCode
                  ? "This incident will be reported, please try again."
                  : "You can now access your safe.",
              ]}
              onComplete={() =>
                new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                  onComplete()
                )
              }
            />
          )}
        </p>
      </div>
      <div className="text-right text-green-400 text-sm">🛡️</div>
    </DialogContainer>
  );
}
