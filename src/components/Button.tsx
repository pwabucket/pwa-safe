import { forwardRef, useRef } from "react";

import useButtonClick from "../hooks/useButtonClick";
import type { DynamicComponentProps } from "../types/types";
import { cn } from "../lib/utils";

const Button = forwardRef<Element, DynamicComponentProps<"button">>(
  ({ as, ...props }, externalRef) => {
    const internalRef = useRef<Element>(null);
    const ref = externalRef ?? internalRef;

    const Component = as || "button";

    useButtonClick(ref);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(
          "cursor-pointer",
          "px-6 py-2 bg-green-500 text-black",
          props.className
        )}
      />
    );
  }
);

export default Button;
