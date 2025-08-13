import { type DropzoneOptions, useDropzone } from "react-dropzone";
import Card from "./Card";

export const EntryFormDropzone = ({
  type = "file",
  ...props
}: DropzoneOptions & { type?: "file" | "image" }) => {
  /** Dropzone */
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

  return (
    <Card
      {...getRootProps()}
      className="text-sm text-center min-h-24 flex flex-col justify-center gap-2"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the {type} here ...</p>
      ) : (
        <p>
          Drag 'n' drop the {type} here, or click to select {type}
        </p>
      )}
    </Card>
  );
};
