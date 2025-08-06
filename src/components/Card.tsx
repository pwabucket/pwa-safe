import { cn } from "../lib/utils";

export default function Card(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "relative border border-green-500 px-6 py-4 text-green-300",
        props.className
      )}
    >
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />
      {props.children}
    </div>
  );
}
