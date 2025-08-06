import bcrypt from "bcryptjs";
import { Link } from "react-router";
import { ReactTyped } from "react-typed";
import { useCallback } from "react";

import AccessCodeDialog from "../components/AccessCodeDialog";
import AccessCodeInput from "../components/AccessCodeInput";
import Button from "../components/Button";
import useAccessCodeDialogManager from "../hooks/useAccessCodeDialogManager";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";

function Welcome() {
  const accessCode = useAppStore((state) => state.accessCode);
  const setIsAuthenticated = useAppStore((state) => state.setIsAuthenticated);

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

      const passed = await bcrypt.compare(code, accessCode || "");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      stopProcessing();
      if (!passed) {
        markInvalidAccessCode();
        return;
      }
      setIsAuthenticated(true);
    },
    [
      accessCode,
      setIsAuthenticated,
      showDialog,
      startProcessing,
      stopProcessing,
      markInvalidAccessCode,
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

      {accessCode ? (
        <>
          <AccessCodeInput onFilled={handleAccessCodeSubmit} />
          <AccessCodeDialog
            mode="verify"
            isDialogVisible={isDialogVisible}
            isProcessing={isProcessing}
            isInvalidAccessCode={isInvalidAccessCode}
            onComplete={() => hideDialog()}
          />
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
