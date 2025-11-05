import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Tabs } from "radix-ui";
import {
  MdOutlineKey,
  MdTextFields,
  MdImage,
  MdAttachFile,
  MdDelete,
  MdEdit,
} from "react-icons/md";

import Button from "./Button";
import Input from "./Input";
import Textarea from "./Textarea";
import type { Entry, EntryFormData } from "../types/entry";
import { EntryFormDropzone } from "./EntryFormDropzone";
import { EntryFormFileContent } from "./EntryFormFileContent";
import { EntryFormImageContent } from "./EntryFormImageContent";
import { EntryFormTabContent } from "./EntryFormTabContent";
import { EntryFormTabTriggerButton } from "./EntryFormTabTriggerButton";

export default function EntryForm({
  disableTitle = false,
  onSubmit,
}: {
  disableTitle?: boolean;
  onSubmit: SubmitHandler<EntryFormData>;
}) {
  const { control, handleSubmit, watch, setValue } = useForm<EntryFormData>({
    defaultValues: { type: "text", content: "" },
  });

  const type = watch("type");

  const handleTypeChange = (formEntryType: Entry["type"]) => {
    setValue("content", formEntryType === "text" ? "" : null);
    setValue("type", formEntryType);
  };

  const handleFileChange = (
    onChange: (file: File) => void,
    accept?: string
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    if (accept) {
      input.accept = accept;
    }
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const selectedFile = files[0];
        if (selectedFile.type.startsWith("image/")) {
          setValue("type", "image");
        }
        onChange(selectedFile);
      }
    };
    input.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {!disableTitle && (
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <>
              <Input placeholder="Title" {...field} />
              {fieldState.error && (
                <span className="text-red-200 text-sm">Title is required</span>
              )}
            </>
          )}
        />
      )}

      <Tabs.Root
        value={type}
        onValueChange={(value) => handleTypeChange(value as Entry["type"])}
        className="w-full flex flex-col gap-4"
      >
        <Tabs.List className="grid grid-cols-3 gap-2">
          <EntryFormTabTriggerButton value="text">
            <MdTextFields className="size-4" />
            Text
          </EntryFormTabTriggerButton>
          <EntryFormTabTriggerButton value="image">
            <MdImage className="size-4" />
            Image
          </EntryFormTabTriggerButton>
          <EntryFormTabTriggerButton value="file">
            <MdAttachFile className="size-4" />
            File
          </EntryFormTabTriggerButton>
        </Tabs.List>

        {/* Text */}
        <EntryFormTabContent value="text">
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  value={field.value as string}
                  placeholder="Content"
                  minRows={4}
                />

                {/* Character Count */}
                <p className="text-xs text-green-400">
                  {typeof field.value === "string" ? field.value.length : 0}{" "}
                  characters
                </p>

                {/* Error Message */}
                {fieldState.error && (
                  <span className="text-red-200 text-sm">
                    Content is required
                  </span>
                )}
              </>
            )}
          />
        </EntryFormTabContent>

        {/* Image */}
        <EntryFormTabContent value="image">
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                {!field.value ? (
                  <EntryFormDropzone
                    type="image"
                    accept={{ "image/*": [] }}
                    maxFiles={1}
                    onDrop={(acceptedFiles) => {
                      if (acceptedFiles.length > 0) {
                        field.onChange(acceptedFiles[0]);
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <EntryFormImageContent content={field.value as File} />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => field.onChange(null)}
                        className="flex-1"
                      >
                        <MdDelete className="size-4" />
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          handleFileChange(field.onChange, "image/*")
                        }
                        className="flex-1"
                      >
                        <MdEdit className="size-4" />
                        Change
                      </Button>
                    </div>
                  </div>
                )}
                {fieldState.error && (
                  <span className="text-red-200 text-sm">
                    Image is required
                  </span>
                )}
              </>
            )}
          />
        </EntryFormTabContent>

        {/* File */}
        <EntryFormTabContent value="file">
          <Controller
            control={control}
            name="content"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <>
                {!field.value ? (
                  <EntryFormDropzone
                    type="file"
                    maxFiles={1}
                    onDrop={(acceptedFiles) => {
                      if (acceptedFiles.length > 0) {
                        if (acceptedFiles[0].type.startsWith("image/")) {
                          setValue("type", "image");
                        }

                        field.onChange(acceptedFiles[0]);
                      }
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <EntryFormFileContent content={field.value as File} />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => field.onChange(null)}
                        className="flex-1"
                      >
                        <MdDelete className="size-4" />
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleFileChange(field.onChange)}
                        className="flex-1"
                      >
                        <MdEdit className="size-4" />
                        Change
                      </Button>
                    </div>
                  </div>
                )}
                {fieldState.error && (
                  <span className="text-red-200 text-sm">File is required</span>
                )}
              </>
            )}
          />
        </EntryFormTabContent>
      </Tabs.Root>

      <Button type="submit">
        <MdOutlineKey className="size-5" />
        Encrypt
      </Button>
    </form>
  );
}
