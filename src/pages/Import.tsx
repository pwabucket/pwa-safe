import { useNavigate } from "react-router";
import { useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import FileDropzone from "../components/FileDropzone";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import { extractZipBackup } from "../lib/utils";

export default function Import() {
  const navigate = useNavigate();
  const dialogManager = useDialogManager();
  const importEntries = useAppStore((state) => state.importEntries);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleImport = async () => {
    if (!importFile) {
      alert("Please select a file to import.");
      return;
    }

    dialogManager.showDialog();
    dialogManager.startProcessing();

    const { entries, vaults } = await extractZipBackup(importFile);

    await safe.importEntries(vaults);
    await importEntries(entries);

    dialogManager.markAsSuccess();
  };

  return (
    <InnerAppLayout headerTitle={"Import"} className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2">
        <h2>Import Your Entries</h2>
        <p className="text-sm text-green-100">
          Choose a file to import your entries. The data will be processed and
          saved securely.
        </p>
      </Card>

      <FileDropzone
        title="Backup File"
        value={importFile}
        onDrop={(file) => setImportFile(file)}
      />

      <Button type="submit" onClick={handleImport}>
        Import
      </Button>

      <ProcessDialog
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        onFinished={() => navigate("/dashboard", { replace: true })}
        title="Data Log"
        description="Entries Import"
        successMessage="Entries Imported Successfully!"
      />
    </InnerAppLayout>
  );
}
