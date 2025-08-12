import { memo } from "react";

import Card from "./Card";

export const EntryFormImageContent = memo(({ content }: { content: File }) => {
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
