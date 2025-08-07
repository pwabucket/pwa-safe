import type { SubmitHandler } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

import Button from "./Button";
import Card from "./Card";

export interface DecryptionFormData {
  encryptedBundle: File;
}

const Dropzone = ({
  title,
  value,
  onDrop,
}: {
  title: string;
  value: File | null;
  onDrop: (file: File) => void;
}) => {
  /** Dropzone */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/zip": [".zip"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles[0]);
      }
    },
    multiple: false,
  });

  return (
    <Card {...getRootProps()} className="text-sm text-center">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the {title} here ...</p>
      ) : value ? (
        <>
          <p className="text-sm text-center text-green-100 truncate">
            {value.name}
          </p>
          <p className="text-xs text-center text-green-500 truncate">
            {value.type}
          </p>
        </>
      ) : (
        <p>
          Drag 'n' drop the {title} here, or click to select the {title}
        </p>
      )}
    </Card>
  );
};

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
      <Dropzone
        title="Encrypted Bundle"
        value={encryptedBundle}
        onDrop={(file) => setValue("encryptedBundle", file)}
      />

      <Button type="submit">Decrypt</Button>
    </form>
  );
}
