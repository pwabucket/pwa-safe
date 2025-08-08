import useSound from "use-sound";
import { useEffect } from "react";

import clickSfx from "../assets/sounds/button-click.ogg";

export default function useButtonClick<T extends Element>(
  ref: React.RefObject<T | null>
) {
  const [play] = useSound(clickSfx, {
    volume: 0.5,
  });

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
