import JSZip from "jszip";
import { ReactTyped } from "react-typed";
import { useState } from "react";

import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import { downloadFile } from "../lib/utils";

export default function Export() {
  const dialogManager = useDialogManager();
  const entries = useAppStore((state) => state.entries);
  const [result, setResult] = useState<Blob | null>(null);

  const handleExport = async () => {
    dialogManager.showDialog();
    dialogManager.startProcessing();

    const zip = new JSZip();

    await Promise.all(
      entries.map(async (entry) => {
        const vault = await safe.getEntry(entry.id);

        /** Encrypted key files */
        zip.file(`${entry.id}/key.salt`, vault.encryptedKey.salt);
        zip.file(
          `${entry.id}/key.enc`,
          vault.encryptedKey.encrypted as Uint8Array
        );

        /** Encrypted data files */
        zip.file(`${entry.id}/data.salt`, vault.encryptedData.salt);
        zip.file(
          `${entry.id}/data.enc`,
          vault.encryptedData.encrypted as Uint8Array
        );
      })
    );

    /** Entries file */
    zip.file("entries.json", JSON.stringify(entries, null, 2));

    zip.generateAsync({ type: "blob" }).then((content) => {
      setResult(content);
      dialogManager.resetDialogState();
    });
  };

  return (
    <InnerAppLayout headerTitle={"Export"} className="flex flex-col gap-4">
      {result ? (
        <>
          <p className="flex flex-col gap-2 bg-green-500/5 text-green-500 p-4">
            <h2>Export Successful</h2>
            <p className="text-sm text-green-100">
              <ReactTyped
                strings={["Your entries have been successfully exported!"]}
                typeSpeed={20}
                showCursor={false}
              />
            </p>
          </p>
          <Button
            onClick={() => {
              downloadFile(result, "exported_entries.zip");
            }}
          >
            Download Exported Entries
          </Button>
        </>
      ) : (
        <>
          <p className="flex flex-col gap-2 bg-green-500/5 text-green-500 p-4">
            <h2>Export Your Entries</h2>
            <p className="text-sm text-green-100">
              Click the button below to export your entries. The data will be
              processed and saved securely.
            </p>
            <p className="text-sm text-green-100">
              Total Entries:{" "}
              <span className="text-green-500">{entries.length}</span>
            </p>
          </p>

          <Button type="submit" onClick={handleExport}>
            Export
          </Button>
        </>
      )}

      <ProcessDialog
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        title="Data Log"
        description="Data Export"
      />
    </InnerAppLayout>
  );
}
