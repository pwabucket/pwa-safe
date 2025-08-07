import { Navigate } from "react-router";
import { ReactTyped } from "react-typed";
import { useCallback } from "react";

import AccessCodeDialog from "../components/AccessCodeDialog";
import AccessCodeInput from "../components/AccessCodeInput";
import useAccessCodeDialogManager from "../hooks/useAccessCodeDialogManager";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";

export default function CreateAccessCode() {
  const {
    isDialogVisible,
    isProcessing,
    showDialog,
    hideDialog,
    startProcessing,
    stopProcessing,
  } = useAccessCodeDialogManager();

  const accessCodeHash = useAppStore((state) => state.accessCodeHash);
  const setAccessCode = useAppStore((state) => state.setAccessCode);
  const handleAccessCodeCreated = useCallback(
    async (code: string) => {
      showDialog();
      startProcessing();
      await setAccessCode(code);
      await new Promise((resolve) => setTimeout(resolve, 500));
      stopProcessing();
    },
    [setAccessCode, showDialog, startProcessing, stopProcessing]
  );

  if (accessCodeHash) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        "min-h-dvh p-4 w-full max-w-sm mx-auto"
      )}
    >
      <h1 className="text-2xl text-center text-green-500">Access Code</h1>

      <p className="text-center bg-green-500/5 text-green-500 p-4">
        <ReactTyped
          typeSpeed={20}
          strings={["Let's setup your account by creating an access code."]}
        />
      </p>
      <AccessCodeInput onFilled={handleAccessCodeCreated} />

      <AccessCodeDialog
        mode="create"
        isDialogVisible={isDialogVisible}
        isProcessing={isProcessing}
        onComplete={() => hideDialog()}
      />
    </div>
  );
}
