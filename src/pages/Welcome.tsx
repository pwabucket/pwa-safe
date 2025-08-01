import { ReactTyped } from "react-typed";
import { useState } from "react";

import AppIcon from "../assets/icon.svg";
import Button from "../components/Button";
import Input from "../components/Input";
import Keypad, { KeyPadButton } from "../components/Keypad";
import { cn } from "../lib/utils";

function Welcome() {
  const [accessCode, setAccessCode] = useState("");
  const handleInput = (value: string) => {
    if (value === "X") {
      setAccessCode((prev) => prev.slice(0, -1));
    } else {
      setAccessCode((prev) => prev + value);
    }
  };
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-4",
        "min-h-dvh p-4 w-full max-w-sm mx-auto"
      )}
    >
      <img src={AppIcon} alt="App Icon" className="size-26 mx-auto" />
      <h1 className="font-audiowide text-4xl text-center">Safe</h1>
      <p className="text-center text-green-500">
        <ReactTyped
          typeSpeed={50}
          backSpeed={50}
          strings={["Welcome Agent", "To your encrypted safe"]}
        />
      </p>

      <div className="flex gap-2">
        <Input
          value={accessCode}
          type="password"
          placeholder="Access Code"
          className="text-center w-full"
          onChange={(e) => setAccessCode(e.target.value)}
        />

        <KeyPadButton className="px-4 py-2" onClick={() => handleInput("X")}>
          X
        </KeyPadButton>
      </div>

      <Keypad onInput={handleInput} />

      <Button>Proceed</Button>
    </div>
  );
}

export default Welcome;
