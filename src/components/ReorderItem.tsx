import { HiOutlineBars3 } from "react-icons/hi2";
import { Reorder, useDragControls } from "motion/react";
import { memo } from "react";

import Button from "./Button";
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
        <Button
          borders={false}
          className={cn(
            "touch-none bg-transparent p-0 px-4",
            hideHandle && "hidden"
          )}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <HiOutlineBars3 className="size-5" />
        </Button>
      </div>
    </Reorder.Item>
  );
});
