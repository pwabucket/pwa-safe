import OTPInput from "react-otp-input";

import Input from "./Input";
import { cn } from "../lib/utils";

export default function AccessCodeOTPInput({
  input,
  updateInput,
}: {
  input: string;
  updateInput: (value: string) => void;
}) {
  return (
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
  );
}
