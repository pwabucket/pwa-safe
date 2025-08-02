import OTPInput from "react-otp-input";
import { ReactTyped } from "react-typed";
import { useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import Keypad from "../components/Keypad";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";

function AccessCodeCheck() {
  const [input, setInput] = useState("");
  const handleInput = (value: string) => {
    if (value === "X") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => (prev + value).slice(0, 6));
    }
  };

  return (
    <>
      <OTPInput
        value={input}
        onChange={setInput}
        numInputs={6}
        inputType="password"
        containerStyle={"flex gap-2"}
        inputStyle={"basis-0 grow"}
        renderInput={(props) => <Input {...props} />}
      />

      <Keypad onInput={handleInput} />
    </>
  );
}

function Welcome() {
  const entries = useAppStore((state) => state.entries);

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        "min-h-dvh p-4 w-full max-w-sm mx-auto"
      )}
    >
      <h1 className="font-audiowide text-8xl text-center text-green-500">
        safe
      </h1>
      <p className="text-center text-green-500">
        <ReactTyped
          loop
          backDelay={2500}
          strings={[
            "Welcome, Agent",
            "Mission Briefing: Confidential",
            "Secure Channel Established",
            "Decrypting Payload...",
            "SAFE Online — No Backdoors Detected",
          ]}
        />
      </p>

      {entries.length > 0 ? (
        <AccessCodeCheck />
      ) : (
        <>
          <Button>Start</Button>
        </>
      )}
    </div>
  );
}

export default Welcome;
