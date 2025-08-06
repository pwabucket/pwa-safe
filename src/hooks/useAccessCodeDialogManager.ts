import { useCallback, useState } from "react";

export default function useAccessCodeDialogManager() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInvalidAccessCode, setIsInvalidAccessCode] = useState(false);

  const showDialog = useCallback(() => setIsDialogVisible(true), []);
  const hideDialog = useCallback(() => setIsDialogVisible(false), []);
  const startProcessing = useCallback(() => setIsProcessing(true), []);
  const stopProcessing = useCallback(() => setIsProcessing(false), []);
  const markInvalidAccessCode = useCallback(
    () => setIsInvalidAccessCode(true),
    []
  );
  const resetInvalidAccessCode = useCallback(
    () => setIsInvalidAccessCode(false),
    []
  );

  return {
    isDialogVisible,
    isProcessing,
    isInvalidAccessCode,
    showDialog,
    hideDialog,
    startProcessing,
    stopProcessing,
    markInvalidAccessCode,
    resetInvalidAccessCode,
  };
}
