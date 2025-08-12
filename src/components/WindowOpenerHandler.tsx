import { Dialog } from "radix-ui";
import { HiOutlineXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import Button from "./Button";
import DialogContainer from "./DialogContainer";
import Input from "./Input";
import safe from "../services/safe";
import useAccessCode from "../hooks/useAccessCode";
import useAppStore from "../store/useAppStore";
import useProcessManager from "../hooks/useProcessManager";
import type { Entry } from "../types/entry";
import { EntryFormFileContent } from "./EntryFormFileContent";
import { createMetadata } from "../lib/utils";
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router";

interface OpenerData {
  filename: string;
  type: Entry["type"];
  content: string | Blob | File;
}

interface WindowOpenerFormData {
  title: string;
}

const ALLOWED_ORIGINS = (import.meta.env.VITE_OPENER_ALLOWED_ORIGINS as string)
  .split(",")
  .map((origin) => origin.trim());

console.log("Allowed origins:", ALLOWED_ORIGINS);

const WindowOpenerForm = ({
  content,
  isProcessing = false,
  onSubmit,
}: {
  content: File;
  isProcessing: boolean;
  onSubmit: SubmitHandler<WindowOpenerFormData>;
}) => {
  const form = useForm<WindowOpenerFormData>({
    defaultValues: {
      title: "",
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Input */}
      <Input
        {...form.register("title", { required: true })}
        disabled={isProcessing}
        placeholder="Title"
      />

      {/* File Content */}
      <EntryFormFileContent content={content} />

      {/* Encrypt Button */}
      <Button type="submit" disabled={isProcessing}>
        {" "}
        {isProcessing ? "Processing..." : "Encrypt"}
      </Button>
    </form>
  );
};

export default function WindowOpenerHandler() {
  const accessCode = useAccessCode();
  const addEntry = useAppStore((state) => state.addEntry);

  const processManager = useProcessManager();
  const [openerData, setOpenerData] = useState<OpenerData | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.opener && window.opener !== window) {
      const handleMessage = (event: MessageEvent) => {
        if (!ALLOWED_ORIGINS.includes(event.origin)) return;
        setOpenerData(event.data);
      };

      window.addEventListener("message", handleMessage);
      window.opener.postMessage("ready", "*");

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, []);

  const handleSubmit = async ({ title }: { title: string }) => {
    processManager.startProcessing();

    const content = (openerData?.content as File).arrayBuffer();
    const dataToEncrypt = await content;
    const result = await safe.createEntry({
      accessCode: accessCode as string,
      content: dataToEncrypt,
    });

    const entry: Entry = {
      id: result.id,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createMetadata(openerData!.type, openerData!.content),
    };

    addEntry(entry);
    setEntry(entry);

    processManager.markAsSuccess();
    window.opener?.postMessage("Entry Created", "*");
  };

  return (
    <>
      {openerData ? (
        <Dialog.Root defaultOpen onOpenChange={() => setOpenerData(null)}>
          <DialogContainer>
            {/* Dialog Header */}
            <div className="flex gap-4 items-start">
              <div className="grow min-w-0">
                <Dialog.Title>Encrypt Data</Dialog.Title>
                <Dialog.Description className="text-sm text-green-100">
                  {processManager.isSuccess
                    ? "Status"
                    : "Add a new entry to your vault."}
                </Dialog.Description>
              </div>
              <Dialog.Close
                disabled={processManager.isProcessing}
                className="text-green-200 p-2 cursor-pointer border border-green-500"
              >
                <HiOutlineXMark className="size-5" />
              </Dialog.Close>
            </div>

            {processManager.isSuccess ? (
              <ReactTyped
                typeSpeed={20}
                strings={["Entry Created Successfully!"]}
                onComplete={() =>
                  new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
                    navigate(`/entries/${entry?.id}`)
                  )
                }
              />
            ) : (
              <WindowOpenerForm
                content={openerData!.content as File}
                isProcessing={processManager.isProcessing}
                onSubmit={handleSubmit}
              />
            )}
          </DialogContainer>
        </Dialog.Root>
      ) : null}
    </>
  );
}
