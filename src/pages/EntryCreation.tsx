import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import EntryForm from "../components/EntryForm";
import InnerAppLayout from "../layouts/InnerAppLayout";
import ProcessDialog from "../components/ProcessDialog";
import safe from "../services/safe";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import type { Entry, EntryFormData } from "../types/entry";
import { createMetadata } from "../lib/utils";

export default function EntryCreation() {
  const accessCode = useAccessCode();
  const addEntry = useAppStore((state) => state.addEntry);
  const dialogManager = useDialogManager();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<Entry | null>(null);

  const handleEncrypt: SubmitHandler<EntryFormData> = async (data) => {
    dialogManager.showDialog();
    dialogManager.startProcessing();

    const content =
      data.content instanceof File || data.content instanceof Blob
        ? data.content.arrayBuffer()
        : data.content;
    const dataToEncrypt = await content;
    const result = await safe.createEntry({
      accessCode: accessCode as string,
      content: dataToEncrypt,
    });

    const entry: Entry = {
      id: result.id,
      title: data.title as string,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createMetadata(data.type, data.content),
    };

    addEntry(entry);
    setEntry(entry);

    dialogManager.markAsSuccess();
  };

  return (
    <InnerAppLayout headerTitle="Create Entry">
      <EntryForm onSubmit={handleEncrypt} />

      <ProcessDialog
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        onFinished={() => navigate(`/entries/${entry?.id}`, { replace: true })}
        title="Data Log"
        description="Entry Creation"
        successMessage="Entry Created Successfully!"
      />
    </InnerAppLayout>
  );
}
