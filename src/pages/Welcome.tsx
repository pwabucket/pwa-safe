import { Dialog } from "radix-ui";
import { Link, useNavigate } from "react-router";
import { ReactTyped } from "react-typed";
import { useCallback } from "react";

import AccessCodeDialog from "../components/AccessCodeDialog";
import AccessCodeInput from "../components/AccessCodeInput";
import Button from "../components/Button";
import DialogContainer from "../components/DialogContainer";
import SafeManager from "../lib/SafeManager";
import useAccessCodeDialogManager from "../hooks/useAccessCodeDialogManager";
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
    const safeManager = new SafeManager();
    await safeManager.clearEntries();
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

function Welcome() {
  const navigate = useNavigate();
  const accessCodeHash = useAppStore((state) => state.accessCodeHash);
  const verifyAccessCode = useAppStore((state) => state.verifyAccessCode);

  const {
    isDialogVisible,
    isProcessing,
    isInvalidAccessCode,
    showDialog,
    hideDialog,
    startProcessing,
    markValidAccessCode,
    markInvalidAccessCode,
  } = useAccessCodeDialogManager();

  const resetDialog = useDialogManager();

  const handleAccessCodeSubmit = useCallback(
    async (code: string) => {
      showDialog();
      startProcessing();

      const passed = await verifyAccessCode(code);

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (passed) {
        markValidAccessCode();
      } else {
        markInvalidAccessCode();
      }
    },
    [
      showDialog,
      startProcessing,
      markValidAccessCode,
      markInvalidAccessCode,
      verifyAccessCode,
    ]
  );

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        "min-h-dvh p-4 w-full max-w-sm mx-auto"
      )}
    >
      <h1 className="text-6xl text-center text-green-500 font-audiowide">
        safe
      </h1>
      <p className="text-center text-green-500 px-4">
        <ReactTyped
          backDelay={2500}
          strings={[
            "Welcome, Agent",
            "Mission Briefing: Confidential",
            "Secure Channel Established",
            "Decrypting Payload...",
            "SAFE Online — No Backdoors Detected",
          ]}
        />
      </p>

      <p className="bg-green-500/5 text-green-500 p-4">
        <span className="font-bold">SAFE</span> is a secure vault for your
        secrets, passwords, and sensitive information.
      </p>

      {accessCodeHash ? (
        <>
          <AccessCodeInput onFilled={handleAccessCodeSubmit} />
          <AccessCodeDialog
            mode="verify"
            isDialogVisible={isDialogVisible}
            isProcessing={isProcessing}
            isInvalidAccessCode={isInvalidAccessCode}
            onComplete={() => {
              if (isInvalidAccessCode) hideDialog();
              else navigate("/dashboard");
            }}
          />

          <button
            onClick={resetDialog.showDialog}
            className="text-xs text-green-100 mt-4 cursor-pointer"
          >
            INITIATE VOID SEQUENCE
          </button>
        </>
      ) : (
        <>
          <Button as={Link} to="/create-access-code" className="text-center">
            Start
          </Button>
        </>
      )}

      <ResetSafe dialogManager={resetDialog} />
    </div>
  );
}

export default Welcome;
