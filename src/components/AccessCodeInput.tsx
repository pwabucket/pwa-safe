import { useCallback, useState } from "react";
import Keypad from "./Keypad";
import AccessCodeOTPInput from "./AccessCodeOTPInput";

export default function AccessCodeInput({
  onFilled,
}: {
  onFilled?: (value: string) => void;
}) {
  const [input, setInput] = useState("");

  const updateInput = useCallback(
    (value: string) => {
      const newValue = value.slice(0, 6);
      setInput(newValue);
      if (newValue.length === 6 && onFilled) {
        onFilled(newValue);
      }
    },
    [onFilled]
  );

  /** Handle keypad input */
  const handleKeypadInput = useCallback(
    (value: string) => {
      updateInput(input + value);
    },
    [input, updateInput]
  );

  const clearInput = useCallback(() => setInput(""), []);
  const deleteInput = useCallback(
    () => setInput((prev) => prev.slice(0, -1)),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <AccessCodeOTPInput input={input} updateInput={updateInput} />

      <Keypad
        onInput={handleKeypadInput}
        onClear={clearInput}
        onDelete={deleteInput}
      />
    </div>
  );
}
