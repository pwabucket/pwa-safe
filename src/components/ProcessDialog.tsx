import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";

import DialogContainer from "./DialogContainer";

export default function ProcessDialog({
  isOpen,
  isProcessing,
  isError = false,
  onFinished,
  title,
  description,
  successMessage = "Operation completed successfully!",
  errorMessage = "Operation failed. Please try again.",
}: {
  title?: string;
  description?: string;
  successMessage?: string;
  errorMessage?: string;
  isOpen: boolean;
  isProcessing: boolean;
  isError?: boolean;
  onFinished?: () => void;
}) {
  return (
    <Dialog.Root open={isOpen}>
      <DialogContainer onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex gap-2">
          <div className="grow min-w-0">
            <Dialog.Title className="text-xs uppercase text-green-300">
              {title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {description}
            </Dialog.Description>

            <p className={isError ? "text-red-100" : "text-green-100"}>
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <ReactTyped
                  typeSpeed={20}
                  strings={[isError ? errorMessage : successMessage]}
                  onComplete={() =>
                    new Promise((resolve) => setTimeout(resolve, 2000)).then(
                      () => onFinished?.()
                    )
                  }
                />
              )}
            </p>
          </div>
          <div className="text-right text-green-400 text-sm">🛡️</div>
        </div>
      </DialogContainer>
    </Dialog.Root>
  );
}
