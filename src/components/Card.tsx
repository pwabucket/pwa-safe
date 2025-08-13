import Borders from "./Borders";
import { cn } from "../lib/utils";

type CardProps = React.ComponentProps<"div"> & {
  variant?: "default" | "subtle";
};

export default function Card({ variant = "default", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative",
        {
          default: "border border-green-500 px-6 py-4 text-green-300",
          subtle: "bg-green-500/5 text-green-500 p-4",
        }[variant],
        props.className
      )}
    >
      {variant === "default" && <Borders />}
      {props.children}
    </div>
  );
}
