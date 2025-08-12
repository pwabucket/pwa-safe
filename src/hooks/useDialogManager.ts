import { useCallback, useState } from "react";

import useProcessManager from "./useProcessManager";

export default function useDialogManager() {
  const {
    isProcessing,
    isSuccess,
    isError,
    startProcessing,
    stopProcessing,
    markAsFailed,
    markAsSuccess,
    resetStatus,
  } = useProcessManager();
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const showDialog = useCallback(() => setIsDialogVisible(true), []);
  const hideDialog = useCallback(() => setIsDialogVisible(false), []);

  const resetDialogState = useCallback(() => {
    setIsDialogVisible(false);
    resetStatus();
  }, [resetStatus]);

  const start = useCallback(() => {
    showDialog();
    resetStatus();
    startProcessing();
  }, [showDialog, resetStatus, startProcessing]);

  return {
    isDialogVisible,
    isProcessing,
    isSuccess,
    isError,
    start,
    showDialog,
    hideDialog,
    startProcessing,
    stopProcessing,
    markAsFailed,
    markAsSuccess,
    resetStatus,
    resetDialogState,
  };
}
