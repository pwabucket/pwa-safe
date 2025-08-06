import useAccessCode from "./useAccessCode";

export default function useIsLoggedIn(): boolean {
  return Boolean(useAccessCode());
}
