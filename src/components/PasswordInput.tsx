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
        className="border border-l-0 border-green-500 px-2 cursor-pointer hover:bg-neutral-600"
      >
        {show ? (
          <HiOutlineEye className="text-green-500 size-5" />
        ) : (
          <HiOutlineEyeSlash className="text-green-500 size-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
