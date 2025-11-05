import { HiOutlineBars3 } from "react-icons/hi2";
import { Reorder, useDragControls } from "motion/react";
import { memo } from "react";

import { cn } from "../lib/utils";

type ReorderItemProps = React.ComponentProps<typeof Reorder.Item> & {
  hideHandle?: boolean;
};

export default memo(function ReorderItem({
  children,
  hideHandle,
  ...props
}: ReorderItemProps) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item {...props} dragListener={false} dragControls={dragControls}>
      <div className="flex gap-2">
        <div className="min-w-0 min-h-0 grow">{children}</div>
        <button
          type="button"
          className={cn(
            "touch-none bg-transparent p-0 px-4",
            "bg-neutral-700 hover:bg-neutral-600 cursor-pointer",
            hideHandle && "hidden"
          )}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <HiOutlineBars3 className="size-5 stroke-2" />
        </button>
      </div>
    </Reorder.Item>
  );
});
