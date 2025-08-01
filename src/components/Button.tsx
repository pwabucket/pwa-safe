import useSound from "use-sound";
import { forwardRef, useEffect, useRef } from "react";

import clickSfx from "../assets/sounds/button-click.wav";
import type { DynamicComponentProps } from "../types/types";
import { cn } from "../lib/utils";

const Button = forwardRef<Element, DynamicComponentProps<"button">>(
  ({ as, ...props }, externalRef) => {
    const internalRef = useRef<Element>(null);
    const ref = externalRef ?? internalRef;

    const [play] = useSound(clickSfx);
    const Component = as || "button";

    useEffect(() => {
      if (ref && typeof ref === "object" && ref.current) {
        const element = ref.current;
        const handleClick = () => play();

        element.addEventListener("click", handleClick);

        return () => {
          element.removeEventListener("click", handleClick);
        };
      }
    }, [ref, play]);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn("cursor-pointer", "px-6 py-2 bg-green-500 text-black")}
      />
    );
  }
);

export default Button;
