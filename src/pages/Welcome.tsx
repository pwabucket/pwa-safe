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
import { cn } from "../lib/utils";

const ResetSafe = () => {
  const clearEntries = useAppStore((state) => state.clearEntries);
  const resetAccessCode = useAppStore((state) => state.resetAccessCode);

  const handleReset = async () => {
    const safeManager = new SafeManager();
    await safeManager.clearEntries();
    clearEntries();
    resetAccessCode();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-xs text-green-100 mt-4 cursor-pointer">
        INITIATE VOID SEQUENCE
      </Dialog.Trigger>

      <DialogContainer>
        <Dialog.Title className="text-xs uppercase text-green-300">
          Void Sequence
        </Dialog.Title>
        <Dialog.Description className="text-yellow-100">
          Initiating Safe reset. All entries and access codes will be
          permanently erased.
        </Dialog.Description>

        <Button variant="danger" className="my-2" onClick={handleReset}>
          Proceed
        </Button>

        <Dialog.Close className="cursor-pointer">Abort</Dialog.Close>
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
    stopProcessing,
    markInvalidAccessCode,
  } = useAccessCodeDialogManager();

  const handleAccessCodeSubmit = useCallback(
    async (code: string) => {
      showDialog();
      startProcessing();

      const passed = await verifyAccessCode(code);
      await new Promise((resolve) => setTimeout(resolve, 500));
      stopProcessing();
      if (!passed) {
        markInvalidAccessCode();
        return;
      }
    },
    [
      showDialog,
      startProcessing,
      stopProcessing,
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

          <ResetSafe />
        </>
      ) : (
        <>
          <Button as={Link} to="/create-access-code" className="text-center">
            Start
          </Button>
        </>
      )}
    </div>
  );
}

export default Welcome;
