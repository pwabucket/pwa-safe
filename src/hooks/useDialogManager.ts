import { useCallback, useState } from "react";

export default function useDialogManager() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const showDialog = useCallback(() => setIsDialogVisible(true), []);
  const hideDialog = useCallback(() => setIsDialogVisible(false), []);
  const startProcessing = useCallback(() => setIsProcessing(true), []);
  const stopProcessing = useCallback(() => setIsProcessing(false), []);

  const markAsFailed = useCallback(() => {
    setIsProcessing(false);
    setIsError(true);
    setIsSuccess(false);
  }, []);

  const markAsSuccess = useCallback(() => {
    setIsProcessing(false);
    setIsSuccess(true);
    setIsError(false);
  }, []);

  const resetStatus = useCallback(() => {
    setIsProcessing(false);
    setIsSuccess(false);
    setIsError(false);
  }, []);

  const resetDialogState = useCallback(() => {
    setIsDialogVisible(false);
    resetStatus();
  }, [resetStatus]);

  return {
    isDialogVisible,
    isProcessing,
    isSuccess,
    isError,
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
