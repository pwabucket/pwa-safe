import useAppStore from "../store/useAppStore";

export default function useIsLoggedIn(): boolean {
  const decryptedAccessCode = useAppStore((state) => state.decryptedAccessCode);
  return Boolean(decryptedAccessCode);
}
