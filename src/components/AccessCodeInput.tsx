import { MdOutlineShield } from "react-icons/md";

import AccessCodeInputTypeToggle from "./AccessCodeInputTypeToggle";
import AccessCodeOTPInput from "./AccessCodeOTPInput";
import Button from "./Button";
import Keypad from "./Keypad";
import PasswordInput from "./PasswordInput";
import type { useAccessCodeInput } from "../hooks/useAccessCodeInput";

export default function AccessCodeInput({
  manager,
}: {
  manager: ReturnType<typeof useAccessCodeInput>;
}) {
  return (
    <form onSubmit={manager.submitAccessCode} className="flex flex-col gap-4">
      {manager.accessCodeInputType === "pin" ? (
        <>
          <AccessCodeInputTypeToggle
            inputType={manager.accessCodeInputType}
            onClick={manager.changeInputType}
          />
          <AccessCodeOTPInput
            input={manager.input}
            updateInput={manager.updateKeypadInput}
          />
          <Keypad
            onInput={manager.addKeypadInput}
            onClear={manager.clearInput}
            onDelete={manager.deleteKeypadInput}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <AccessCodeInputTypeToggle
              inputType={manager.accessCodeInputType}
              onClick={manager.changeInputType}
            />
            <PasswordInput
              value={manager.input}
              onChange={(e) => manager.setInput(e.target.value)}
              placeholder="Access Code"
            />
          </div>
          <Button type="submit">
            <MdOutlineShield className="size-4" />
            Submit
          </Button>
        </>
      )}
    </form>
  );
}
