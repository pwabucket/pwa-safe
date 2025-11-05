import { HiOutlinePencil } from "react-icons/hi2";
import { Link, useParams } from "react-router";
import { ReactTyped } from "react-typed";
import { useState } from "react";

import Button from "../components/Button";
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
import {
  MdFilePresent,
  MdOutlineFileDownload,
  MdOutlineImage,
  MdOutlineSearch,
  MdOutlineTextFields,
} from "react-icons/md";

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
      <div className="bg-neutral-700 p-4 flex gap-4">
        <span className="text-xs uppercase text-green-100 shrink-0">
          {entry.type === "image" ? (
            <MdOutlineImage className="size-7" />
          ) : entry.type === "file" ? (
            <MdFilePresent className="size-7" />
          ) : (
            <MdOutlineTextFields className="size-7" />
          )}
        </span>

        <div className="min-w-0">
          <h1 className="font-bold">{entry.title}</h1>
          <p className="text-xs text-green-100 font-audiowide">
            <ReactTyped
              strings={[new Date(entry.createdAt).toString()]}
              typeSpeed={5}
              showCursor={false}
            />
          </p>
        </div>
      </div>

      <Button onClick={downloadBundle} variant={"secondary"}>
        <MdOutlineFileDownload className="size-5" />
        Download Encrypted Bundle
      </Button>

      {content ? (
        <DecryptedContent metadata={entry} content={content} />
      ) : (
        <Button onClick={handleDecrypt} className="font-bold">
          <MdOutlineSearch className="size-5" />
          Decrypt Data
        </Button>
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
