import { type SubmitHandler } from "react-hook-form";
import { useCallback, useState } from "react";
import InnerAppLayout from "../layouts/InnerAppLayout";
import { extractZipBundle } from "../lib/utils";
import DecryptionForm, {
  type DecryptionFormData,
} from "../components/DecryptionForm";
import AccessCodePrompt from "../components/AccessCodePrompt";
import useDialogManager from "../hooks/useDialogManager";
import type { EncryptedMetadata } from "../types/entry";
import DecryptedContent from "../components/DecryptedContent";
import safe from "../services/safe";

export default function DecryptContent() {
  const dialogManager = useDialogManager();
  const [formData, setFormData] = useState<DecryptionFormData | null>(null);
  const [result, setResult] = useState<{
    metadata: EncryptedMetadata;
    data: string | Blob | File;
  } | null>(null);

  const handleDecrypt: SubmitHandler<DecryptionFormData> = async (data) => {
    setFormData(data);
    dialogManager.showDialog();
  };

  const decryptContent = useCallback(
    async (accessCode: string) => {
      dialogManager.startProcessing();

      try {
        const data = formData as DecryptionFormData;
        const { metadata, encryptedKey, encryptedData } =
          await extractZipBundle(data.encryptedBundle);

        const decrypted = await safe.decryptContent({
          encryptedData,
          encryptedKey,
          accessCode,
        });

        const result =
          metadata.type === "text"
            ? new TextDecoder().decode(decrypted)
            : new File([decrypted], metadata.filename as string, {
                type: metadata.filetype as string,
                lastModified: metadata.fileLastModified,
              });

        setResult({
          metadata,
          data: result,
        });

        setFormData(null);

        dialogManager.markAsSuccess();
      } catch (error) {
        console.error("Decryption failed:", error);
        dialogManager.markAsFailed();
      }
    },
    [formData, dialogManager]
  );

  return (
    <InnerAppLayout headerTitle="Decrypt Content" className="gap-4">
      {result ? (
        <>
          <DecryptedContent metadata={result.metadata} content={result.data} />
        </>
      ) : (
        <>
          <p className="bg-green-500/5 text-green-100 p-4">
            Decrypt your content manually and securely.
          </p>
          <DecryptionForm onSubmit={handleDecrypt} />
        </>
      )}

      <AccessCodePrompt
        mode="decrypt"
        dialogManager={dialogManager}
        onAccessCode={decryptContent}
      />
    </InnerAppLayout>
  );
}
