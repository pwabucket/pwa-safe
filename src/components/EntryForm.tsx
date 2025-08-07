import type { SubmitHandler } from "react-hook-form";
import { Tabs } from "radix-ui";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { useForm } from "react-hook-form";

import Button from "./Button";
import Input from "./Input";
import Textarea from "./Textarea";
import type { Entry, EntryFormData } from "../types/entry";
import { cn } from "../lib/utils";
import Card from "./Card";
import { memo } from "react";

const TabTriggerButton = (props: React.ComponentProps<typeof Tabs.Trigger>) => (
  <Tabs.Trigger
    {...props}
    className={cn(
      "cursor-pointer text-sm p-2",
      "border border-transparent",
      "data-[state=active]:border-green-500",
      "data-[state=active]:text-green-500"
    )}
  />
);

const TabContent = (props: React.ComponentProps<typeof Tabs.Content>) => (
  <Tabs.Content {...props} className="flex flex-col gap-4">
    {props.children}
  </Tabs.Content>
);

const Dropzone = ({
  type = "file",
  ...props
}: DropzoneOptions & { type?: "file" | "image" }) => {
  /** Dropzone */
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

  return (
    <Card {...getRootProps()} className="text-sm text-center">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the {type} here ...</p>
      ) : (
        <p>
          Drag 'n' drop the {type} here, or click to select {type}
        </p>
      )}
    </Card>
  );
};

const ImageContent = memo(({ content }: { content: File }) => {
  return (
    <Card className="flex flex-col gap-2">
      <img
        src={URL.createObjectURL(content)}
        onLoad={(e) => {
          URL.revokeObjectURL((e.target as HTMLImageElement).src);
        }}
        alt="Preview"
        className="w-full max-h-96 object-contain"
      />
      <span className="text-sm text-center text-green-100 truncate">
        {content.name}
      </span>
    </Card>
  );
});

const FileContent = memo(({ content }: { content: File }) => {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-sm text-center text-green-100 truncate">
        {content.name}
      </span>
      <span className="text-xs text-center text-green-500 truncate">
        {content.type}
      </span>
    </Card>
  );
});

export default function EntryForm({
  disableTitle = false,
  onSubmit,
}: {
  disableTitle?: boolean;
  onSubmit: SubmitHandler<EntryFormData>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<EntryFormData>({ defaultValues: { type: "text" } });

  const type = watch("type");
  const content = watch("content");

  const handleTypeChange = (value: Entry["type"]) => {
    setValue("type", value);
    resetField("content");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {!disableTitle && (
        <Input placeholder="Title" {...register("title", { required: true })} />
      )}

      <Tabs.Root
        value={type}
        onValueChange={(value) => handleTypeChange(value as Entry["type"])}
        className="w-full flex flex-col gap-4"
      >
        <Tabs.List className="grid grid-cols-3 gap-2">
          <TabTriggerButton value="text">Text</TabTriggerButton>
          <TabTriggerButton value="image">Image</TabTriggerButton>
          <TabTriggerButton value="file">File</TabTriggerButton>
        </Tabs.List>

        {/* Text */}
        <TabContent value="text">
          <Textarea
            {...register("content", { required: true })}
            placeholder="Content"
            rows={4}
          />
        </TabContent>

        {/* Image */}
        <TabContent value="image">
          <Dropzone
            type="image"
            accept={{ "image/*": [] }}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length > 0) {
                setValue("content", acceptedFiles[0]);
              }
            }}
            maxFiles={1}
          />
          {content && <ImageContent content={content as File} />}
          {errors.content && (
            <span className="text-red-200 text-sm">Image is required</span>
          )}
        </TabContent>

        {/* File */}
        <TabContent value="file">
          {content && <FileContent content={content as File} />}
          <Dropzone
            type="file"
            accept={{ "application/*": [] }}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles.length > 0) {
                setValue("content", acceptedFiles[0]);
              }
            }}
            maxFiles={1}
          />
          {errors.content && (
            <span className="text-red-200 text-sm">File is required</span>
          )}
        </TabContent>
      </Tabs.Root>

      <Button type="submit">Encrypt</Button>
    </form>
  );
}
