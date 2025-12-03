import { useNavigate } from "react-router";
import { useState } from "react";
import { MdSecurity } from "react-icons/md";

import AccessCodeInputTypeToggle from "../components/AccessCodeInputTypeToggle";
import AccessCodeOTPInput from "../components/AccessCodeOTPInput";
import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import PasswordInput from "../components/PasswordInput";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import { useMutation } from "@tanstack/react-query";

const AccessCodeUpdateInput = ({
  title,
  value,
  setValue,
}: {
  title: string;
  value: string;
  setValue: (newValue: string) => void;
}) => {
  const accessCodeInputType = useAppStore((state) => state.accessCodeInputType);
  const [inputType, setInputType] = useState(accessCodeInputType);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs text-green-300">{title}</h3>
        <AccessCodeInputTypeToggle
          inputType={inputType}
          onClick={() => setInputType(inputType === "pin" ? "password" : "pin")}
        />
      </div>

      {inputType === "pin" ? (
        <AccessCodeOTPInput input={value} updateInput={setValue} />
      ) : (
        <PasswordInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </>
  );
};

export default function UpdateAccessCode() {
  const entries = useAppStore((state) => state.entries);
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");

  const setAccessCode = useAppStore((state) => state.setAccessCode);
  const verifyAccessCode = useAppStore((state) => state.verifyAccessCode);

  const mutation = useMutation({
    mutationKey: ["update-access-code"],
    mutationFn: async ({
      currentAccessCode,
      newAccessCode,
    }: {
      currentAccessCode: string;
      newAccessCode: string;
    }) => {
      const isValid = await verifyAccessCode(currentAccessCode);

      if (!isValid) {
        throw new Error("Invalid current access code");
      }

      await Promise.all(
        entries.map((entry) =>
          safe.updateAccessCode({
            id: entry.id,
            currentAccessCode,
            newAccessCode,
          })
        )
      );

      return true;
    },
  });

  const updateAccessCode = async () => {
    setShowDialog(true);
    await mutation.mutateAsync({ currentAccessCode, newAccessCode });
    setAccessCode(newAccessCode);
  };

  return (
    <InnerAppLayout headerTitle="Update Access Code" className="gap-4">
      {/* Current Access Code */}
      <AccessCodeUpdateInput
        title="Current Access Code"
        value={currentAccessCode}
        setValue={setCurrentAccessCode}
      />

      {/* New Access Code */}
      <AccessCodeUpdateInput
        title="New Access Code"
        value={newAccessCode}
        setValue={setNewAccessCode}
      />

      <Button onClick={updateAccessCode}>
        <MdSecurity className="size-5" />
        Update Access Code
      </Button>

      <ProcessDialog
        isOpen={showDialog}
        isProcessing={mutation.isPending}
        isError={mutation.isError}
        title="Agent Log"
        description="Access Code Update"
        successMessage="Access Code Updated Successfully!"
        onFinished={() => {
          setShowDialog(false);

          if (!mutation.isError) {
            navigate(-1);
          }
        }}
      />
    </InnerAppLayout>
  );
}
