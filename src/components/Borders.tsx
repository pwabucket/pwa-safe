import { cn } from "../lib/utils";

export default function Borders({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "absolute top-0 left-0 size-3 border-t-2 border-l-2 border-green-500",
          className
        )}
      />
      <span
        className={cn(
          "absolute top-0 right-0 size-3 border-t-2 border-r-2 border-green-500",
          className
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-green-500",
          className
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-green-500",
          className
        )}
      />
    </>
  );
}
