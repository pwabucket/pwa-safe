import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";

import DialogContainer from "./DialogContainer";

export default function ProcessDialog({
  isOpen,
  isProcessing,
  onFinished,
  title,
  description,
  successMessage,
}: {
  isOpen: boolean;
  isProcessing: boolean;
  onFinished?: () => void;
  title?: string;
  description?: string;
  successMessage?: string;
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

            <p className={"text-green-100"}>
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <ReactTyped
                  typeSpeed={20}
                  strings={[
                    successMessage || "Operation completed successfully!",
                  ]}
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
