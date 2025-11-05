import { Link, useNavigate, type LinkProps } from "react-router";

import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import useAppStore from "../store/useAppStore";
import { cn } from "../lib/utils";

const MenuButton = (props: LinkProps) => (
  <Link
    {...props}
    className={cn(
      "block w-full text-center px-4 py-2",
      "bg-neutral-700 hover:bg-neutral-600",
      "text-neutral-400  hover:text-green-500"
    )}
  />
);

export default function Menu() {
  const navigate = useNavigate();
  const clearAccessCode = useAppStore((state) => state.clearAccessCode);

  const signOut = () => {
    clearAccessCode();
    navigate("/", { replace: true });
  };

  return (
    <InnerAppLayout headerTitle="Menu" className="gap-4">
      <MenuButton to="/update-access-code">Update Access Code</MenuButton>

      <h3>Content</h3>
      <div className="grid grid-cols-2 gap-2">
        <MenuButton to="/encrypt">Encrypt Content</MenuButton>

        <MenuButton to="/decrypt">Decrypt Content</MenuButton>
      </div>

      <h3>Backup / Restore</h3>
      <div className="grid grid-cols-2 gap-2">
        <MenuButton to="/export">Export Entries</MenuButton>

        <MenuButton to="/import">Import Entries</MenuButton>
      </div>

      <Button onClick={signOut}>Sign Out</Button>

      <div className="grid grid-cols-2 gap-2 mt-4 text-center">
        <MenuButton to="/privacy-policy">Privacy Policy</MenuButton>

        <MenuButton to="/terms-of-use">Terms of Use</MenuButton>
      </div>

      <p className="text-center text-green-300">
        v{import.meta.env.PACKAGE_VERSION}
      </p>
    </InnerAppLayout>
  );
}
