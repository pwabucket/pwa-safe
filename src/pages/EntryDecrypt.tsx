import { ReactTyped } from "react-typed";
import { useParams } from "react-router";
import { useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import DecryptedContent from "../components/DecryptedContent";
import InnerAppLayout from "../layouts/InnerAppLayout";
import SafeManager from "../lib/SafeManager";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import type { Entry } from "../types/entry";
import { zipAndDownloadBundle } from "../lib/utils";

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

  /** Download Bundle */
  const downloadBundle = async () => {
    const manager = new SafeManager();
    const result = await manager.getEntry(entryId);

    zipAndDownloadBundle({
      filename: entry?.id as string,
      metadata: entry,
      encryptedKey: result?.encryptedKey,
      encryptedData: result?.encryptedData,
    });
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

      <Button onClick={downloadBundle}>Download Encrypted Bundle</Button>

      {content ? (
        <DecryptedContent metadata={entry} content={content} />
      ) : (
        <Button onClick={handleDecrypt}>Decrypt Data</Button>
      )}
    </InnerAppLayout>
  );
}
