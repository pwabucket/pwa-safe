import useSound from "use-sound";
import { useEffect, type ForwardedRef } from "react";

import clickSfx from "../assets/sounds/button-click.wav";

export default function useButtonClick(ref: ForwardedRef<Element>) {
  const [play] = useSound(clickSfx);

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
}
