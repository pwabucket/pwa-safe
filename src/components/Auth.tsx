import { Link } from "react-router";
import { useCallback, useState } from "react";

import AccessCodeDialog from "./AccessCodeDialog";
import AccessCodeInput from "./AccessCodeInput";
import Button from "./Button";
import useAccessCodeDialogManager from "../hooks/useAccessCodeDialogManager";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import { cn } from "../lib/utils";
import AppVersion from "./AppVersion";
import ResetSafe from "./ResetSafe";

function Auth({
  onSuccessfulLogin,
}: {
  onSuccessfulLogin?: (verifiedCode: string | null) => void;
}) {
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
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
        setVerifiedCode(code);
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
      <h1 className="text-6xl text-center text-green-500 font-audiowide leading-none">
        safe
      </h1>

      <p className="bg-green-500/5 text-green-500 text-sm p-4">
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
              else onSuccessfulLogin?.(verifiedCode);
            }}
          />

          <button
            onClick={resetDialog.showDialog}
            className="text-xs text-green-100 cursor-pointer p-1"
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

      <AppVersion />

      <ResetSafe dialogManager={resetDialog} />
    </div>
  );
}

export default Auth;
