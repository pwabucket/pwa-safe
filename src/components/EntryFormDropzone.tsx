import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { MdCloudUpload, MdImage, MdAttachFile, MdError } from "react-icons/md";
import { cn } from "../lib/utils";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getTypeIcon = (type: "file" | "image", isDragActive: boolean) => {
  const iconClass = cn("size-8 mx-auto", isDragActive && "animate-pulse");

  if (type === "image") {
    return <MdImage className={cn(iconClass, "text-green-400")} />;
  }
  return <MdAttachFile className={cn(iconClass, "text-green-400")} />;
};

const getMaxSizeForType = (type: "file" | "image"): number => {
  return type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for files
};

export const EntryFormDropzone = ({
  type = "file",
  maxSize,
  ...props
}: DropzoneOptions & {
  type?: "file" | "image";
}) => {
  const defaultMaxSize = maxSize || getMaxSizeForType(type);

  /** Dropzone */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...props,
    maxSize: defaultMaxSize,
  });

  const hasError = fileRejections.length > 0 || isDragReject;
  const rejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "p-6",
          "text-sm text-center min-h-32 flex flex-col justify-center gap-3",
          "cursor-pointer transition-all duration-200",
          "hover:bg-green-500/10 focus:bg-green-500/10",
          "border-dashed border-2",
          {
            "border-green-400 bg-green-500/15 scale-[1.02]":
              isDragActive && !isDragReject,
            "border-red-400 bg-red-500/15": hasError,
            "border-green-600": !isDragActive && !hasError,
          }
        )}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          isDragReject ? (
            <>
              <MdError className="size-8 text-red-400 mx-auto" />
              <p className="text-red-300 font-medium">Invalid file type</p>
              <p className="text-xs text-red-400">
                Please select a valid {type}
              </p>
            </>
          ) : (
            <>
              <MdCloudUpload className="size-8 text-green-400 mx-auto animate-bounce" />
              <p className="text-green-300 font-medium">
                Drop your {type} here
              </p>
            </>
          )
        ) : (
          <>
            {getTypeIcon(type, false)}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-green-100">
                Choose {type === "image" ? "an image" : "a file"}
              </p>
              <p className="text-xs text-green-300">
                Drag and drop or click to browse
              </p>
              <div className="flex flex-col gap-1 text-xs text-green-500">
                <span>Max size: {formatFileSize(defaultMaxSize)}</span>
                {type === "image" && (
                  <span>Supports: JPG, PNG, GIF, WebP, SVG</span>
                )}
                {type === "file" && (
                  <span>Supports: PDF, DOC, ZIP, Images, and more</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error Messages */}
      {rejectionError && (
        <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
          <MdError className="size-4 flex-shrink-0" />
          <span>{rejectionError}</span>
        </div>
      )}
    </div>
  );
};
