import { HiOutlinePencil } from "react-icons/hi2";
import { Link, useParams } from "react-router";
import { ReactTyped } from "react-typed";
import { useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import DecryptedContent from "../components/DecryptedContent";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import type { Entry } from "../types/entry";
import { HeaderButton } from "../layouts/HeaderButton";
import { zipAndDownloadBundle } from "../lib/utils";

export default function EntryDecryption() {
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

  const dialogManager = useDialogManager();

  const handleDecrypt = async () => {
    dialogManager.start();
    try {
      const decrypted = await safe.decryptEntry({
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
      dialogManager.markAsSuccess();
    } catch (error) {
      console.error("Decryption failed:", error);
      dialogManager.markAsFailed();
    }
  };

  /** Download Bundle */
  const downloadBundle = async () => {
    const result = await safe.getEntry(entryId);

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
      headerRightContent={
        <HeaderButton
          as={Link}
          icon={HiOutlinePencil}
          to={`/entries/${entryId}/update`}
        />
      }
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

      <ProcessDialog
        title="Decrypt Entry"
        description="Decrypting your entry..."
        successMessage="Entry decrypted successfully!"
        errorMessage="Failed to decrypt entry. Please try again."
        isError={dialogManager.isError}
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        onFinished={dialogManager.hideDialog}
      />
    </InnerAppLayout>
  );
}
