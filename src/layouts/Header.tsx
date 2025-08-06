import { cn } from "../lib/utils";

type HeaderProps = {
  leftContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  rightContent?: React.ReactNode;
};

export default function Header({
  leftContent,
  middleContent,
  rightContent,
}: HeaderProps) {
  return (
    <div
      className={cn(
        "bg-neutral-800",
        "border-green-500",
        "shrink-0 sticky top-0 border-b",
        "h-12",
        "z-30"
      )}
    >
      <div className="max-w-md mx-auto h-full flex items-center gap-2 px-1">
        <div className="shrink-0 size-10">{leftContent}</div>
        <div className="grow min-w-0 min-h-0 flex flex-col justify-center text-green-500">
          {middleContent || (
            <h1
              className={cn(
                "text-center text-2xl truncate",
                "flex gap-2 items-center justify-center font-audiowide"
              )}
            >
              {import.meta.env.VITE_APP_NAME}
            </h1>
          )}
        </div>
        <div className="shrink-0 size-10">{rightContent}</div>
      </div>
    </div>
  );
}
