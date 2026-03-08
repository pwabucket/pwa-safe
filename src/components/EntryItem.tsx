import {
  MdChevronRight,
  MdOutlineAttachFile,
  MdOutlineImage,
  MdOutlineTextFields,
} from "react-icons/md";
import { Reorder, useDragControls } from "motion/react";
import { cn, formatFileSize, formatRelativeTime } from "../lib/utils";

import type { Entry } from "../types/entry";
import { Link } from "react-router";

const typeConfig = {
  text: {
    icon: MdOutlineTextFields,
    label: "TEXT",
    accentColor: "bg-green-500",
    iconColor: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  image: {
    icon: MdOutlineImage,
    label: "IMG",
    accentColor: "bg-blue-500",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  file: {
    icon: MdOutlineAttachFile,
    label: "FILE",
    accentColor: "bg-amber-500",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
};

export default function EntryItem({ entry }: { entry: Entry }) {
  const dragControls = useDragControls();
  const config = typeConfig[entry.type];
  const Icon = config.icon;

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={dragControls}
    >
      <div
        className={cn(
          "group relative overflow-hidden",
          "bg-neutral-800 hover:bg-neutral-700",
          "transition-colors duration-200",
          "flex items-stretch",
        )}
      >
        {/* Drag Handle */}
        <div
          className="flex gap-1 touch-none select-none cursor-pointer shrink-0"
          onPointerDown={(event) => dragControls.start(event)}
        >
          {/* Left accent bar */}
          <span className={cn("w-1 shrink-0", config.accentColor)} />

          {/* Icon area */}
          <div
            className={cn(
              "shrink-0 flex items-center justify-center w-10",
              config.bgColor,
            )}
          >
            <Icon className={cn("size-5", config.iconColor)} />
          </div>
        </div>

        <Link
          to={`/entries/${entry.id}`}
          className={cn("flex grow min-w-0 items-center gap-2 px-2")}
        >
          {/* Content */}
          <div className="flex-1 min-w-0 py-1 flex flex-col justify-center gap-0.5">
            <h2 className="truncate font-bold text-sm text-neutral-100 group-hover:text-green-100 transition-colors">
              {entry.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span
                className={cn("font-bold tracking-wider", config.iconColor)}
              >
                {config.label}
              </span>
              <span className="text-neutral-600">|</span>
              <time>{formatRelativeTime(entry.createdAt)}</time>
              {entry.filesize != null && (
                <>
                  <span className="text-neutral-600">|</span>
                  <span>{formatFileSize(entry.filesize)}</span>
                </>
              )}
            </div>
          </div>

          {/* Chevron */}
          <div className="shrink-0 flex items-center">
            <MdChevronRight className="size-5 text-neutral-600 group-hover:text-green-400 transition-colors" />
          </div>
        </Link>
      </div>
    </Reorder.Item>
  );
}
