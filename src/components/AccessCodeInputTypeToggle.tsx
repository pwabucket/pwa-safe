import { cn } from "../lib/utils";

interface AccessCodeInputTypeToggleProps
  extends React.ComponentProps<"button"> {
  inputType: "pin" | "password";
}

const AccessCodeInputTypeToggle = ({
  inputType,
  ...props
}: AccessCodeInputTypeToggleProps) => {
  return (
    <div className="flex justify-end">
      <button
        {...props}
        type="button"
        className={cn(
          "border border-green-500 cursor-pointer text-xs p-1 text-green-500",
          props.className
        )}
      >
        Use {inputType === "pin" ? "Password" : "PIN"}
      </button>
    </div>
  );
};

export default AccessCodeInputTypeToggle;
