import type { SubmitHandler } from "react-hook-form";

import EntryForm from "../components/EntryForm";
import SafeManager from "../lib/SafeManager";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import type { Entry, EntryFormData } from "../types/entry";

export default function Dashboard() {
  const accessCode = useAccessCode();
  const addEntry = useAppStore((state) => state.addEntry);

  const handleEncrypt: SubmitHandler<EntryFormData> = async (data) => {
    const content =
      data.content instanceof File || data.content instanceof Blob
        ? data.content.arrayBuffer()
        : data.content;
    const dataToEncrypt = await content;
    const safeManager = new SafeManager();
    const result = await safeManager.createEntry(accessCode!, dataToEncrypt);
    const entry: Entry = {
      id: result.id,
      title: data.title,
      type: data.type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (data.content instanceof File) {
      entry.filename = data.content.name;
      entry.filetype = data.content.type;
    }

    addEntry(entry);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-green-500">Dashboard</h1>

      <EntryForm onSubmit={handleEncrypt} />
    </div>
  );
}
