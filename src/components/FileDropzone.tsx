import { useDropzone } from "react-dropzone";

import Card from "./Card";

export default function FileDropzone({
  title,
  value,
  onDrop,
}: {
  title: string;
  value: File | null;
  onDrop: (file: File) => void;
}) {
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
    <Card
      {...getRootProps()}
      className="text-sm text-center min-h-24 flex flex-col justify-center gap-2"
    >
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
}
