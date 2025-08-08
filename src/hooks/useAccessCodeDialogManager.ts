import useDialogManager from "./useDialogManager";

export default function useAccessCodeDialogManager() {
  const {
    isDialogVisible,
    isProcessing,
    isError: isInvalidAccessCode,
    markAsSuccess: markValidAccessCode,
    markAsFailed: markInvalidAccessCode,
    resetDialogState: resetInvalidAccessCode,
    showDialog,
    hideDialog,
    startProcessing,
    stopProcessing,
  } = useDialogManager();

  return {
    isDialogVisible,
    isProcessing,
    isInvalidAccessCode,
    showDialog,
    hideDialog,
    startProcessing,
    stopProcessing,
    markValidAccessCode,
    markInvalidAccessCode,
    resetInvalidAccessCode,
  };
}
