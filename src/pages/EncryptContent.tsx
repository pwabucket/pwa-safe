import { type SubmitHandler } from "react-hook-form";
import { useCallback, useState } from "react";
import Button from "../components/Button";
import EntryForm from "../components/EntryForm";
import InnerAppLayout from "../layouts/InnerAppLayout";
import SafeManager, { type EncryptedData } from "../lib/SafeManager";
import type { EncryptionResult } from "../lib/Encrypter";
import type { EncryptedMetadata, EntryFormData } from "../types/entry";
import { createMetadata, uuid, zipAndDownloadBundle } from "../lib/utils";
import { ReactTyped } from "react-typed";
import AccessCodePrompt from "../components/AccessCodePrompt";
import useDialogManager from "../hooks/useDialogManager";

export default function EncryptContent() {
  const dialogManager = useDialogManager();
  const [formData, setFormData] = useState<EntryFormData | null>(null);
  const [result, setResult] = useState<{
    id: string;
    metadata: EncryptedMetadata;
    data: EncryptedData;
  } | null>(null);

  const handleEncrypt: SubmitHandler<EntryFormData> = async (data) => {
    setFormData(data);
    dialogManager.showDialog();
  };

  const encryptContent = useCallback(
    async (accessCode: string) => {
      dialogManager.startProcessing();

      const data = formData as EntryFormData;
      const content =
        data.content instanceof File || data.content instanceof Blob
          ? data.content.arrayBuffer()
          : data.content;
      const dataToEncrypt = await content;
      const safeManager = new SafeManager();
      const result = await safeManager.createEncryption({
        accessCode,
        content: dataToEncrypt,
      });

      const metadata = createMetadata(data.type, data.content);

      setResult({
        id: uuid(),
        metadata,
        data: result,
      });

      setFormData(null);

      dialogManager.markAsSuccess();
    },
    [formData, dialogManager]
  );

  const downloadBundle = async () => {
    zipAndDownloadBundle({
      filename: result?.id as string,
      metadata: result?.metadata as EncryptedMetadata,
      encryptedKey: result?.data.encryptedKey as EncryptionResult,
      encryptedData: result?.data.encryptedData as EncryptionResult,
    });
  };

  return (
    <InnerAppLayout headerTitle="Encrypt Content" className="gap-4">
      {result ? (
        <>
          <h2 className="text-sm text-green-100">
            <ReactTyped
              strings={["Data encrypted successfully!"]}
              typeSpeed={20}
              showCursor={false}
            />
          </h2>

          <Button onClick={downloadBundle}>Download Bundle</Button>
        </>
      ) : (
        <>
          <p className="bg-green-500/5 text-green-100 p-4">
            Encrypt your content manually and securely.
          </p>
          <EntryForm disableTitle onSubmit={handleEncrypt} />
        </>
      )}

      <AccessCodePrompt
        mode="encrypt"
        dialogManager={dialogManager}
        onAccessCode={encryptContent}
      />
    </InnerAppLayout>
  );
}
