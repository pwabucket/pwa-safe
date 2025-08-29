import useAppStore from "../store/useAppStore";

const AccessCodeInputTypeToggle = () => {
  const accessCodeInputType = useAppStore((state) => state.accessCodeInputType);
  const toggleAccessCodeInputType = useAppStore(
    (state) => state.toggleAccessCodeInputType
  );

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={toggleAccessCodeInputType}
        className="border border-green-500 cursor-pointer text-xs p-1 text-green-500"
      >
        Use {accessCodeInputType === "pin" ? "Password" : "PIN"}
      </button>
    </div>
  );
};

export default AccessCodeInputTypeToggle;
