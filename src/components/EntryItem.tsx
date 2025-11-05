import { Link } from "react-router";

import type { Entry } from "../types/entry";
import { cn } from "../lib/utils";
import {
  MdFilePresent,
  MdOutlineImage,
  MdOutlineTextFields,
} from "react-icons/md";

export default function EntryItem({ entry }: { entry: Entry }) {
  return (
    <Link
      to={`/entries/${entry.id}`}
      className={cn(
        "bg-neutral-700 hover:bg-neutral-600",
        "hover:text-green-100",
        "flex gap-2 items-center",
        "px-4 py-2"
      )}
    >
      <h2 className="grow min-w-0 truncate font-bold">{entry.title}</h2>
      <span className="shrink-0 text-green-100">
        {entry.type === "image" ? (
          <MdOutlineImage className="size-5" />
        ) : entry.type === "file" ? (
          <MdFilePresent className="size-5" />
        ) : (
          <MdOutlineTextFields className="size-5" />
        )}
      </span>
    </Link>
  );
}
