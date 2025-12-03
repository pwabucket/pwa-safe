import { Outlet } from "react-router";

import useIsLoggedIn from "../hooks/useIsLoggedIn";
import { Dialog } from "radix-ui";
import { cn } from "../lib/utils";
import Auth from "../components/Auth";
import useAppStore from "../store/useAppStore";

export default function ProtectedRoute() {
  const isLoggedIn = useIsLoggedIn();
  const setDecryptedAccessCode = useAppStore(
    (state) => state.setDecryptedAccessCode
  );
  const handleSuccessfulLogin = (verifiedCode: string | null) => {
    if (verifiedCode !== null) {
      setDecryptedAccessCode(verifiedCode);
    }
  };

  return (
    <>
      {/* Protected Routes */}
      <Outlet />

      {/* Authentication Dialog */}
      {!isLoggedIn && (
        <Dialog.Root open={true}>
          <Dialog.Overlay
            className={cn(
              "fixed inset-0 bg-neutral-800 text-neutral-100",
              "overflow-auto z-100"
            )}
          >
            <Dialog.Content onOpenAutoFocus={(ev) => ev.preventDefault()}>
              <Dialog.Title className="sr-only">
                Authentication Required
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Please log in to access the application.
              </Dialog.Description>
              <Auth onSuccessfulLogin={handleSuccessfulLogin} />
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Root>
      )}
    </>
  );

  return <Outlet />;
}
