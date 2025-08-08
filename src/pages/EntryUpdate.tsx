import { Dialog } from "radix-ui";
import { HiOutlineTrash } from "react-icons/hi2";
import { ReactTyped } from "react-typed";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import Button from "../components/Button";
import DialogContainer from "../components/DialogContainer";
import InnerAppLayout from "../layouts/InnerAppLayout";
import Input from "../components/Input";
import useAppStore from "../store/useAppStore";
import useDialogManager from "../hooks/useDialogManager";
import type { Entry, EntryUpdateFormData } from "../types/entry";
import { HeaderButton } from "../layouts/HeaderButton";

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

      <Dialog.Root open={dialogManager.isDialogVisible}>
        <DialogContainer onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex gap-2">
            <div className="grow min-w-0">
              <Dialog.Title className="text-xs uppercase text-green-300">
                Date Log
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Data Entry Update
              </Dialog.Description>

              <p className={"text-green-100"}>
                {dialogManager.isProcessing ? (
                  <>Processing...</>
                ) : (
                  <ReactTyped
                    typeSpeed={20}
                    strings={["Entry Updated Successfully!"]}
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
