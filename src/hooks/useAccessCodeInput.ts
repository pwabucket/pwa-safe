import { useCallback, useState } from "react";
import useAppStore from "../store/useAppStore";

const useAccessCodeInput = (onFilled: (code: string) => void) => {
  const accessCodeInputType = useAppStore((state) => state.accessCodeInputType);
  const toggleAccessCodeInputType = useAppStore(
    (state) => state.toggleAccessCodeInputType
  );

  /* State for access code input */
  const [input, setInput] = useState("");

  /** Handle keypad input */
  const updateKeypadInput = useCallback(
    (value: string) => {
      const newValue = value.slice(0, 6);
      setInput(newValue);
      if (newValue.length === 6 && onFilled) {
        onFilled(newValue);
      }
    },
    [onFilled]
  );

  /** Add keypad input */
  const addKeypadInput = useCallback(
    (value: string) => {
      updateKeypadInput(input + value);
    },
    [input, updateKeypadInput]
  );

  /** Handle clearing the input */
  const clearInput = useCallback(() => setInput(""), []);

  /** Handle deleting last character from input */
  const deleteKeypadInput = useCallback(
    () => setInput((prev) => prev.slice(0, -1)),
    []
  );

  /** Handle access code submission */
  const submitAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      onFilled?.(input);
    }
  };

  /** Change access code input type */
  const changeInputType = useCallback(() => {
    toggleAccessCodeInputType();
    clearInput();
  }, [toggleAccessCodeInputType, clearInput]);

  return {
    accessCodeInputType,
    input,
    setInput,
    clearInput,
    addKeypadInput,
    updateKeypadInput,
    deleteKeypadInput,
    changeInputType,
    submitAccessCode,
  };
};

export { useAccessCodeInput };
