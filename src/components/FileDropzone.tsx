import { useDropzone } from "react-dropzone";
import {
  MdCloudUpload,
  MdAttachFile,
  MdCheckCircle,
  MdError,
} from "react-icons/md";

import Card from "./Card";
import { cn } from "../lib/utils";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function FileDropzone({
  title,
  value,
  onDrop,
  accept = { "application/zip": [".zip"] },
  maxSize = 10 * 1024 * 1024, // 10MB default
  error,
}: {
  title: string;
  value: File | null;
  onDrop: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  error?: string;
}) {
  /** Dropzone */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles[0]);
      }
    },
    multiple: false,
    maxSize,
  });

  const hasError = error || fileRejections.length > 0 || isDragReject;
  const rejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="flex flex-col gap-2">
      <Card
        {...getRootProps()}
        className={cn(
          "text-sm text-center min-h-32 flex flex-col justify-center gap-3",
          "cursor-pointer transition-all duration-200",
          "hover:bg-green-500/10 focus:bg-green-500/10",
          {
            "border-green-400 bg-green-500/15": isDragActive && !isDragReject,
            "border-red-400 bg-red-500/15": hasError,
            "border-green-600 bg-green-500/5": value && !hasError,
          }
        )}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          isDragReject ? (
            <>
              <MdError className="size-8 text-red-400 mx-auto" />
              <p className="text-red-300">Invalid file type</p>
            </>
          ) : (
            <>
              <MdCloudUpload className="size-8 text-green-400 mx-auto animate-pulse" />
              <p className="text-green-300">Drop the {title} here...</p>
            </>
          )
        ) : value ? (
          <>
            <MdCheckCircle className="size-8 text-green-400 mx-auto" />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-center text-green-100 truncate font-medium">
                {value.name}
              </p>
              <div className="flex justify-center gap-4 text-xs text-green-500">
                <span>{value.type || "Unknown type"}</span>
                <span>{formatFileSize(value.size)}</span>
              </div>
            </div>
            <p className="text-xs text-green-300">
              Click to replace or drag a new file
            </p>
          </>
        ) : (
          <>
            <MdAttachFile className="size-8 text-green-600 mx-auto" />
            <div className="flex flex-col gap-1">
              <p className="font-medium">Drag & drop your {title} here</p>
              <p className="text-xs text-green-300">or click to browse files</p>
              <p className="text-xs text-green-500">
                Max size: {formatFileSize(maxSize)}
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Error Messages */}
      {(error || rejectionError) && (
        <div className="flex items-center gap-2 text-red-300 text-sm">
          <MdError className="size-4" />
          <span>{error || rejectionError}</span>
        </div>
      )}
    </div>
  );
}
