import { useRef } from "react";

import useButtonClick from "../hooks/useButtonClick";
import type { DynamicComponent } from "../types/types";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "cursor-pointer outline-none",
    "relative px-4 py-2",
    "flex justify-center items-center gap-2",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-green-500 text-black"],
        secondary: [
          "font-bold",
          "bg-neutral-700 text-neutral-200",
          "hover:text-green-100",
        ],
        danger: ["bg-red-400 text-black"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  borders?: boolean;
}

const Button: DynamicComponent<"button", ButtonProps> = ({
  as,
  variant,
  className,
  ...props
}) => {
  const Component = as || "button";
  const ref = useRef<HTMLElement | null>(null);

  useButtonClick(ref);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
    >
      {props.children}
    </Component>
  );
};

export default Button;
