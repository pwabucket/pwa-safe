import JSZip from "jszip";
import copy from "copy-to-clipboard";
import { ReactTyped } from "react-typed";
import { useParams } from "react-router";
import { useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import InnerAppLayout from "../layouts/InnerAppLayout";
import SafeManager from "../lib/SafeManager";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import type { EncryptionResult } from "../lib/Encrypter";
import type { Entry } from "../types/entry";

const downloadFile = (content: Blob | File, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = filename;
  link.click();
};

const zipAndDownloadEncryptedResult = (
  title: string,
  encryptionResult: EncryptionResult
) => {
  const zip = new JSZip();

  zip.file(`${title}.salt`, encryptionResult.salt);
  zip.file(`${title}.enc`, encryptionResult.encrypted as Uint8Array);
  zip.generateAsync({ type: "blob" }).then((content) => {
    downloadFile(content, `${title}.zip`);
  });
};

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
  entry,
  content,
}: {
  entry: Entry;
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
      {entry.filename}
    </span>
    <Button
      onClick={() => {
        downloadFile(content, entry.filename as string);
      }}
      className="mt-2"
    >
      Download Image
    </Button>
  </Card>
);

const FileEntryContent = ({
  entry,
  content,
}: {
  entry: Entry;
  content: Blob | File;
}) => (
  <Card className="flex flex-col gap-2">
    <h3 className="text-sm text-center text-green-100 truncate">
      {entry.filename}
    </h3>
    <h4 className="text-xs text-center text-green-500 truncate">
      {entry.filetype}
    </h4>

    <Button
      onClick={() => {
        downloadFile(content, entry.filename as string);
      }}
      className="mt-2"
    >
      Download File
    </Button>
  </Card>
);

export default function EntryDecrypt() {
  const accessCode = useAccessCode();
  const params = useParams();
  if (!params.id) {
    throw new Error("Entry ID is required");
  }
  const entryId = params.id;
  const entry = useAppStore((state) =>
    state.entries.find((entry) => entry.id === entryId)
  ) as Entry;

  const [content, setContent] = useState<string | Blob | File>("");

  const handleDecrypt = async () => {
    const manager = new SafeManager();
    const decrypted = await manager.decryptEntry({
      id: entryId,
      accessCode: accessCode as string,
    });

    const result =
      entry.type === "text"
        ? new TextDecoder().decode(decrypted)
        : new File([decrypted], entry.filename as string, {
            type: entry.filetype as string,
            lastModified: entry.fileLastModified,
          });

    setContent(result);
  };

  /** Download Key */
  const downloadKey = async () => {
    const manager = new SafeManager();
    const encryptedKey = await manager.getEncryptedKey(entryId);

    await zipAndDownloadEncryptedResult(
      `${entryId}-key`,
      encryptedKey as EncryptionResult
    );
  };

  const downloadData = async () => {
    const manager = new SafeManager();
    const encryptedContent = await manager.getEncryptedData(entryId);

    await zipAndDownloadEncryptedResult(
      `${entryId}-data`,
      encryptedContent as EncryptionResult
    );
  };

  return (
    <InnerAppLayout
      headerTitle={entry?.title || "Unknown"}
      className="flex flex-col gap-4"
    >
      <Card>
        <span className="text-xs uppercase text-green-100">{entry.type}</span>
        <h1>{entry.title}</h1>
        <p className="text-xs text-green-100">
          <ReactTyped
            strings={[new Date(entry.createdAt).toString()]}
            typeSpeed={5}
            showCursor={false}
          />
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={downloadKey}>Download Key</Button>
        <Button onClick={downloadData}>Download Data</Button>
      </div>

      {content ? (
        <>
          <h2 className="text-sm text-green-100">
            <ReactTyped
              strings={["Decrypted Content"]}
              typeSpeed={20}
              showCursor={false}
            />
          </h2>
          {entry.type === "text" ? (
            <TextEntryContent content={content as string} />
          ) : entry.type === "image" ? (
            <ImageEntryContent entry={entry} content={content as File} />
          ) : (
            <FileEntryContent entry={entry} content={content as File} />
          )}
        </>
      ) : (
        <Button onClick={handleDecrypt}>Decrypt Data</Button>
      )}
    </InnerAppLayout>
  );
}
