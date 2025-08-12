import { useNavigate } from "react-router";
import { useState } from "react";
import AccessCodeOTPInput from "../components/AccessCodeOTPInput";
import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";

export default function UpdateAccessCode() {
  const entries = useAppStore((state) => state.entries);
  const dialogManager = useDialogManager();
  const navigate = useNavigate();

  const [currentAccessCode, setCurrentAccessCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");

  const setAccessCode = useAppStore((state) => state.setAccessCode);
  const verifyAccessCode = useAppStore((state) => state.verifyAccessCode);

  const updateAccessCode = async () => {
    dialogManager.start();
    const isValid = await verifyAccessCode(currentAccessCode);

    if (isValid) {
      await Promise.all(
        entries.map((entry) =>
          safe.updateAccessCode({
            id: entry.id,
            currentAccessCode,
            newAccessCode,
          })
        )
      );
      setAccessCode(newAccessCode);
      dialogManager.markAsSuccess();
    } else {
      dialogManager.markAsFailed();
    }
  };

  return (
    <InnerAppLayout headerTitle="Update Access Code" className="gap-4">
      <h3 className="text-xs text-green-300">Current Access Code</h3>
      <AccessCodeOTPInput
        input={currentAccessCode}
        updateInput={setCurrentAccessCode}
      />

      <h3 className="text-xs text-green-300">New Access Code</h3>
      <AccessCodeOTPInput
        input={newAccessCode}
        updateInput={setNewAccessCode}
      />

      <Button onClick={updateAccessCode}>Update Access Code</Button>

      <ProcessDialog
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        isError={dialogManager.isError}
        title="Agent Log"
        description="Access Code Update"
        successMessage="Access Code Updated Successfully!"
        onFinished={() => {
          dialogManager.hideDialog();

          if (!dialogManager.isError) {
            navigate(-1);
          }
        }}
      />
    </InnerAppLayout>
  );
}
