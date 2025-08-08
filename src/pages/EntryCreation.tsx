import { Dialog } from "radix-ui";
import { ReactTyped } from "react-typed";
import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";

import DialogContainer from "../components/DialogContainer";
import EntryForm from "../components/EntryForm";
import InnerAppLayout from "../layouts/InnerAppLayout";
import SafeManager from "../lib/SafeManager";
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
    setEntry(entry);

    dialogManager.markAsSuccess();
  };

  return (
    <InnerAppLayout headerTitle="Create Entry">
      <EntryForm onSubmit={handleEncrypt} />

      <Dialog.Root open={dialogManager.isDialogVisible}>
        <DialogContainer onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex gap-2">
            <div className="grow min-w-0">
              <Dialog.Title className="text-xs uppercase text-green-300">
                Date Log
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Data Entry Creation
              </Dialog.Description>

              <p className={"text-green-100"}>
                {dialogManager.isProcessing ? (
                  <>Processing...</>
                ) : (
                  <ReactTyped
                    typeSpeed={20}
                    strings={["Entry Created Successfully!"]}
                    onComplete={() =>
                      new Promise((resolve) => setTimeout(resolve, 2000)).then(
                        () =>
                          navigate(`/entries/${entry?.id}`, { replace: true })
                      )
                    }
                  />
                )}
              </p>
            </div>
            <div className="text-right text-green-400 text-sm">🛡️</div>
          </div>
        </DialogContainer>
      </Dialog.Root>
    </InnerAppLayout>
  );
}
