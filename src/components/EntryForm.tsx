import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Tabs } from "radix-ui";

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
            Text
          </EntryFormTabTriggerButton>
          <EntryFormTabTriggerButton value="image">
            Image
          </EntryFormTabTriggerButton>
          <EntryFormTabTriggerButton value="file">
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
                  rows={4}
                />
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
                {field.value && (
                  <EntryFormImageContent content={field.value as File} />
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
                {field.value && (
                  <EntryFormFileContent content={field.value as File} />
                )}
                {fieldState.error && (
                  <span className="text-red-200 text-sm">File is required</span>
                )}
              </>
            )}
          />
        </EntryFormTabContent>
      </Tabs.Root>

      <Button type="submit">Encrypt</Button>
    </form>
  );
}
