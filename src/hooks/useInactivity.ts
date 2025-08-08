import { useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import useAppStore from "../store/useAppStore";
import useIsLoggedIn from "./useIsLoggedIn";

const EVENTS = [
  "mousemove",
  "keydown",
  "click",
  "scroll",
  "touchstart",
  "touchmove",
  "wheel",
];

export default function useInactivity(duration: number = 5 * 60 * 1000) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedIn = useIsLoggedIn();
  const clearAccessCode = useAppStore((state) => state.clearAccessCode);

  /** Callback to Reset Timeout */
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(clearAccessCode, duration);
  }, [clearAccessCode, duration]);

  /** Register Effect */
  useEffect(() => {
    if (!isLoggedIn) return;

    /** Callback to Reset Timeout */

    /** Register Events */
    EVENTS.forEach(function (name) {
      window.addEventListener(name, resetTimer, true);
    });

    /** Initial Timeout  */
    timeoutRef.current = setTimeout(clearAccessCode, duration);

    return () => {
      /** Remove Events */
      EVENTS.forEach(function (name) {
        window.removeEventListener(name, resetTimer, true);
      });

      /** Reset Timeout */
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [duration, isLoggedIn, resetTimer, clearAccessCode]);
}
