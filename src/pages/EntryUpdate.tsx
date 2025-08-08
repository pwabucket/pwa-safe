import { HiOutlineTrash } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import Input from "../components/Input";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import type { Entry, EntryUpdateFormData } from "../types/entry";
import { HeaderButton } from "../layouts/HeaderButton";
import ProcessDialog from "../components/ProcessDialog";

export default function EntryUpdate() {
  const dialogManager = useDialogManager();
  const navigate = useNavigate();
  const params = useParams();
  if (!params.id) {
    throw new Error("Entry ID is required");
  }

  const entryId = params.id;
  const entry = useAppStore((state) =>
    state.entries.find((entry) => entry.id === entryId)
  ) as Entry;

  const updateEntry = useAppStore((state) => state.updateEntry);
  const removeEntry = useAppStore((state) => state.removeEntry);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryUpdateFormData>({ defaultValues: { title: entry?.title } });

  const onSubmit = (data: EntryUpdateFormData) => {
    dialogManager.showDialog();
    dialogManager.startProcessing();
    updateEntry(entryId, {
      ...entry,
      title: data.title,
      updatedAt: Date.now(),
    });
    dialogManager.markAsSuccess();
  };

  const onDelete = () => {
    removeEntry(entryId);
    navigate("/dashboard", { replace: true });
  };

  return (
    <InnerAppLayout
      headerTitle={`Update: ${entry?.title || "Unknown"}`}
      headerRightContent={
        <HeaderButton icon={HiOutlineTrash} onClick={onDelete} />
      }
      className="flex flex-col gap-4"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Input Title */}
        <div className="flex flex-col gap-2">
          <Input {...register("title", { required: "Title is required" })} />
          {errors.title && (
            <span className="text-red-300 text-sm">{errors.title.message}</span>
          )}
        </div>

        <Button type="submit">Update Entry</Button>
      </form>

      <ProcessDialog
        isOpen={dialogManager.isDialogVisible}
        isProcessing={dialogManager.isProcessing}
        onFinished={() => navigate(`/entries/${entry?.id}`, { replace: true })}
        title="Data Log"
        description="Entry Update"
        successMessage="Entry Updated Successfully!"
      />
    </InnerAppLayout>
  );
}
