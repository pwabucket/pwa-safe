import OTPInput from "react-otp-input";
import { useCallback, useState } from "react";

import Input from "./Input";
import Keypad from "./Keypad";
import { cn } from "../lib/utils";

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
      <OTPInput
        value={input}
        onChange={updateInput}
        numInputs={6}
        inputType="password"
        containerStyle={"flex gap-2"}
        inputStyle={cn(
          "basis-0 grow text-green-500  font-bold font-mono text-center",
          "border-transparent bg-neutral-700 focus:border-green-500"
        )}
        renderInput={(props) => <Input {...props} />}
      />

      <Keypad
        onInput={handleKeypadInput}
        onClear={clearInput}
        onDelete={deleteInput}
      />
    </div>
  );
}
