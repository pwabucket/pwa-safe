import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useState } from "react";

import Input from "./Input";
import { cn } from "../lib/utils";

const PasswordInput = (props: React.ComponentProps<"input">) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex">
      <Input
        {...props}
        className={cn("grow min-w-0", props.className)}
        type={show ? "text" : "password"}
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className={cn(
          "px-2 cursor-pointer bg-neutral-700 hover:bg-neutral-600",
          "text-neutral-500 hover:text-green-400"
        )}
      >
        {show ? (
          <HiOutlineEye className="size-5 stroke-3 text-green-400" />
        ) : (
          <HiOutlineEyeSlash className="size-5 stroke-3" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
