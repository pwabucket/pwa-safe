import { useRef } from "react";

import useButtonClick from "../hooks/useButtonClick";
import { cn } from "../lib/utils";

export const KeyPadButton = (
  props: React.ComponentPropsWithoutRef<"button">
) => {
  const ref = useRef<HTMLButtonElement>(null);

  useButtonClick(ref);

  return (
    <button
      {...props}
      ref={ref}
      className={cn(
        "p-4 bg-neutral-700 cursor-pointer font-bold",
        "border border-transparent hover:border-green-500",
        props.className
      )}
    />
  );
};

const Keypad = ({ onInput }: { onInput: (value: string) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <KeyPadButton onClick={() => onInput("1")}>1</KeyPadButton>
      <KeyPadButton onClick={() => onInput("2")}>2</KeyPadButton>
      <KeyPadButton onClick={() => onInput("3")}>3</KeyPadButton>
      <KeyPadButton onClick={() => onInput("4")}>4</KeyPadButton>
      <KeyPadButton onClick={() => onInput("5")}>5</KeyPadButton>
      <KeyPadButton onClick={() => onInput("6")}>6</KeyPadButton>
      <KeyPadButton onClick={() => onInput("7")}>7</KeyPadButton>
      <KeyPadButton onClick={() => onInput("8")}>8</KeyPadButton>
      <KeyPadButton onClick={() => onInput("9")}>9</KeyPadButton>
      <KeyPadButton onClick={() => onInput("0")} className="col-start-2">
        0
      </KeyPadButton>
    </div>
  );
};

export default Keypad;
