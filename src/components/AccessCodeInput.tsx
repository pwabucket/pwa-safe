import OTPInput from "react-otp-input";
import { useEffect, useState } from "react";

import Input from "./Input";
import Keypad from "./Keypad";
import { cn } from "../lib/utils";

export default function AccessCodeInput({
  onFilled,
}: {
  onFilled?: (value: string) => void;
}) {
  const [input, setInput] = useState("");
  const handleInput = (value: string) => {
    setInput((prev) => (prev + value).slice(0, 6));
  };

  const clearInput = () => setInput("");
  const deleteInput = () => setInput((prev) => prev.slice(0, -1));

  useEffect(() => {
    if (input.length === 6) {
      onFilled?.(input);
    }
  }, [input, onFilled]);

  return (
    <div className="flex flex-col gap-4">
      <OTPInput
        value={input}
        onChange={setInput}
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
        onInput={handleInput}
        onClear={clearInput}
        onDelete={deleteInput}
      />
    </div>
  );
}
