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
import Card from "../components/Card";

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
          <Card variant="subtle" className="flex flex-col gap-2">
            <h2>Custom Decryption</h2>
            <p className="text-sm text-green-100">
              Decrypt your content securely with a custom access code.
            </p>
          </Card>
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
