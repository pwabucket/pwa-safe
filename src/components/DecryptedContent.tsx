import copy from "copy-to-clipboard";
import { ReactTyped } from "react-typed";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import type { EncryptedMetadata } from "../types/entry";
import { downloadFile } from "../lib/utils";

const TextEntryContent = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Card className="flex flex-col gap-4">
      <div className="whitespace-pre-line wrap-break-word p-4 bg-green-500/5 text-green-500">
        {content as string}
      </div>
      <Button
        onClick={() => {
          copy(content as string);
          setCopied(true);
        }}
        className="mt-2"
      >
        {copied ? "Copied!" : "Copy to Clipboard"}
      </Button>
    </Card>
  );
};

const ImageEntryContent = ({
  metadata,
  content,
}: {
  metadata: EncryptedMetadata;
  content: Blob | File;
}) => (
  <Card className="flex flex-col gap-4">
    <img
      src={URL.createObjectURL(content)}
      onLoad={(e) => {
        URL.revokeObjectURL((e.target as HTMLImageElement).src);
      }}
      alt="Decrypted Content"
      className="w-full max-h-96 object-contain"
    />

    {/* Filename */}
    <span className="text-sm text-center text-green-100 truncate">
      {metadata.filename}
    </span>
    <Button
      onClick={() => {
        downloadFile(content, metadata.filename as string);
      }}
      className="mt-2"
    >
      Download Image
    </Button>
  </Card>
);

const FileEntryContent = ({
  metadata,
  content,
}: {
  metadata: EncryptedMetadata;
  content: Blob | File;
}) => (
  <Card className="flex flex-col gap-2">
    <h3 className="text-sm text-center text-green-100 truncate">
      {metadata.filename}
    </h3>
    <h4 className="text-xs text-center text-green-500 truncate">
      {metadata.filetype}
    </h4>

    <Button
      onClick={() => {
        downloadFile(content, metadata.filename as string);
      }}
      className="mt-2"
    >
      Download File
    </Button>
  </Card>
);

export default function DecryptedContent({
  metadata,
  content,
}: {
  metadata: EncryptedMetadata;
  content: string | Blob | File;
}) {
  return (
    <>
      <h2 className="text-sm text-green-100">
        <ReactTyped
          strings={["Decrypted Content"]}
          typeSpeed={20}
          showCursor={false}
        />
      </h2>

      {metadata.type === "text" ? (
        <TextEntryContent content={content as string} />
      ) : metadata.type === "image" ? (
        <ImageEntryContent metadata={metadata} content={content as Blob} />
      ) : (
        <FileEntryContent metadata={metadata} content={content as Blob} />
      )}
    </>
  );
}
