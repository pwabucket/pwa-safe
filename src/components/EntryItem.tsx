import { Link } from "react-router";

import Button from "./Button";
import type { Entry } from "../types/entry";

export default function EntryItem({ entry }: { entry: Entry }) {
  return (
    <Button as={Link} to={`/entries/${entry.id}`} className="flex gap-2">
      <h2 className="text-green-300 grow min-w-0">{entry.title}</h2>
      <p className="text-xs text-green-100 uppercase">{entry.type}</p>
    </Button>
  );
}
