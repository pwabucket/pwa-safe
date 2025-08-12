import { memo } from "react";

import Card from "./Card";

export const EntryFormFileContent = memo(({ content }: { content: File }) => {
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
