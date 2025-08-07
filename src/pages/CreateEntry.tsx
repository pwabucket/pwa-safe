import type { SubmitHandler } from "react-hook-form";

import EntryForm from "../components/EntryForm";
import InnerAppLayout from "../layouts/InnerAppLayout";
import SafeManager from "../lib/SafeManager";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import type { Entry, EntryFormData } from "../types/entry";
import { createMetadata } from "../lib/utils";

export default function CreateEntry() {
  const accessCode = useAccessCode();
  const addEntry = useAppStore((state) => state.addEntry);

  const handleEncrypt: SubmitHandler<EntryFormData> = async (data) => {
    const content =
      data.content instanceof File || data.content instanceof Blob
        ? data.content.arrayBuffer()
        : data.content;
    const dataToEncrypt = await content;
    const safeManager = new SafeManager();
    const result = await safeManager.createEntry({
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
  };

  return (
    <InnerAppLayout headerTitle="Create Entry">
      <EntryForm onSubmit={handleEncrypt} />
    </InnerAppLayout>
  );
}
