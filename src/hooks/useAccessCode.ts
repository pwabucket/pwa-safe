import useAppStore from "../store/useAppStore";

export default function useAccessCode() {
  return useAppStore((state) => state.decryptedAccessCode);
}
