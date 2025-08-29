import { useCallback, useState } from "react";

import AccessCodeOTPInput from "./AccessCodeOTPInput";
import Button from "./Button";
import Keypad from "./Keypad";
import PasswordInput from "./PasswordInput";
import useAppStore from "../store/useAppStore";

const AccessCodeInputTypeToggle = () => {
  const accessCodeInputType = useAppStore((state) => state.accessCodeInputType);
  const toggleAccessCodeInputType = useAppStore(
    (state) => state.toggleAccessCodeInputType
  );

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={toggleAccessCodeInputType}
        className="border border-green-500 cursor-pointer text-xs p-1 text-green-500"
      >
        Use {accessCodeInputType === "pin" ? "Password" : "PIN"}
      </button>
    </div>
  );
};

export default function AccessCodeInput({
  onFilled,
}: {
  onFilled?: (value: string) => void;
}) {
  const accessCodeInputType = useAppStore((state) => state.accessCodeInputType);

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

  const submitAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      onFilled?.(input);
    }
  };

  return (
    <form onSubmit={submitAccessCode} className="flex flex-col gap-4">
      {accessCodeInputType === "pin" ? (
        <>
          <AccessCodeInputTypeToggle />
          <AccessCodeOTPInput input={input} updateInput={updateInput} />
          <Keypad
            onInput={handleKeypadInput}
            onClear={clearInput}
            onDelete={deleteInput}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <AccessCodeInputTypeToggle />
            <PasswordInput
              onChange={(e) => setInput(e.target.value)}
              placeholder="Access Code"
            />
          </div>
          <Button type="submit">Submit</Button>
        </>
      )}
    </form>
  );
}
