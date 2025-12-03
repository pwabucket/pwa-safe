import { Link } from "react-router";
import { useCallback, useState } from "react";

import AccessCodeDialog from "./AccessCodeDialog";
import AccessCodeInput from "./AccessCodeInput";
import Button from "./Button";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";
import AppVersion from "./AppVersion";
import ResetSafe from "./ResetSafe";
import { useMutation } from "@tanstack/react-query";
import { useAccessCodeInput } from "../hooks/useAccessCodeInput";

function Auth({ onSuccessfulLogin }: { onSuccessfulLogin?: () => void }) {
  const accessCodeHash = useAppStore((state) => state.accessCodeHash);
  const setDecryptedAccessCode = useAppStore(
    (state) => state.setDecryptedAccessCode
  );
  const verifyAccessCode = useAppStore((state) => state.verifyAccessCode);
  const [showAccessCodeDialog, setShowAccessCodeDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  /* Mutation to verify access code */
  const mutation = useMutation({
    mutationKey: ["verify-access-code"],
    mutationFn: async (code: string) => {
      const passed = await verifyAccessCode(code);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!passed) {
        throw new Error("Invalid access code");
      }

      return { code };
    },
  });

  /* Handle access code submission */
  const handleAccessCodeSubmit = useCallback(
    async (code: string) => {
      setShowAccessCodeDialog(true);
      mutation.mutate(code);
    },
    [mutation]
  );

  /* Handle completion of access code verification */
  const handleOnComplete = () => {
    setShowAccessCodeDialog(false);
    if (mutation.data) {
      setDecryptedAccessCode(mutation.data.code);
      onSuccessfulLogin?.();
    }
  };

  const inputManager = useAccessCodeInput(handleAccessCodeSubmit);

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
          <AccessCodeInput manager={inputManager} />
          <AccessCodeDialog
            mode="verify"
            isDialogVisible={showAccessCodeDialog}
            isProcessing={mutation.isPending}
            isInvalidAccessCode={mutation.isError}
            onComplete={handleOnComplete}
          />

          <button
            onClick={() => setShowResetDialog(true)}
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

      <ResetSafe open={showResetDialog} onOpenChange={setShowResetDialog} />
    </div>
  );
}

export default Auth;
