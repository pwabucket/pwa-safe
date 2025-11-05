import { Link, useNavigate, type LinkProps } from "react-router";

import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import useAppStore from "../store/useAppStore";
import {
  MdOutlineKey,
  MdLockOpen,
  MdSecurity,
  MdFileUpload,
  MdFileDownload,
  MdLogout,
  MdPrivacyTip,
  MdGavel,
} from "react-icons/md";
import AppVersion from "../components/AppVersion";

const MenuButton = (props: LinkProps) => (
  <Button
    as={Link}
    {...props}
    variant={"secondary"}
    className="justify-start"
  />
);

const MenuHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-green-300 font-bold">{children}</h3>
);

const MenuSection = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-2">{children}</div>
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
      {/* Account */}
      <MenuHeader>Account</MenuHeader>
      <MenuButton to="/update-access-code">
        <MdSecurity className="size-5" />
        Update Access Code
      </MenuButton>

      {/* Content */}
      <MenuHeader>Content</MenuHeader>
      <MenuSection>
        <MenuButton to="/encrypt">
          <MdOutlineKey className="size-5" />
          Encrypt Content
        </MenuButton>

        <MenuButton to="/decrypt">
          <MdLockOpen className="size-5" />
          Decrypt Content
        </MenuButton>
      </MenuSection>

      {/* Backup / Restore */}
      <MenuHeader>Backup / Restore</MenuHeader>
      <MenuSection>
        <MenuButton to="/export">
          <MdFileUpload className="size-5" />
          Export Entries
        </MenuButton>

        <MenuButton to="/import">
          <MdFileDownload className="size-5" />
          Import Entries
        </MenuButton>
      </MenuSection>

      {/* Legal */}
      <MenuHeader>Legal</MenuHeader>
      <MenuSection>
        <MenuButton to="/privacy-policy">
          <MdPrivacyTip className="size-5" />
          Privacy Policy
        </MenuButton>

        <MenuButton to="/terms-of-use">
          <MdGavel className="size-5" />
          Terms of Use
        </MenuButton>
      </MenuSection>

      <Button onClick={signOut}>
        <MdLogout className="size-5" />
        Sign Out
      </Button>

      <AppVersion />
    </InnerAppLayout>
  );
}
