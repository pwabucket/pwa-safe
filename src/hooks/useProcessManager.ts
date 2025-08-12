import { useCallback, useState } from "react";

export default function useProcessManager() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

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

  return {
    isProcessing,
    isSuccess,
    isError,
    startProcessing,
    stopProcessing,
    markAsFailed,
    markAsSuccess,
    resetStatus,
  };
}
