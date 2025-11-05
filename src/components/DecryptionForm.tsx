import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { MdLockOpen } from "react-icons/md";

import Button from "./Button";
import FileDropzone from "./FileDropzone";

export interface DecryptionFormData {
  encryptedBundle: File;
}

export default function DecryptionForm({
  onSubmit,
}: {
  onSubmit: SubmitHandler<DecryptionFormData>;
}) {
  const { handleSubmit, watch, setValue } = useForm<DecryptionFormData>();

  const encryptedBundle = watch("encryptedBundle");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h4 className="text-xs text-green-100">Encrypted Bundle</h4>
      <FileDropzone
        title="Encrypted Bundle"
        value={encryptedBundle}
        onDrop={(file) => setValue("encryptedBundle", file)}
      />

      <Button type="submit">
        <MdLockOpen className="size-5" />
        Decrypt
      </Button>
    </form>
  );
}
