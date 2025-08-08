import { Link, useNavigate } from "react-router";

import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";
import useAppStore from "../store/useAppStore";

export default function Menu() {
  const navigate = useNavigate();
  const clearAccessCode = useAppStore((state) => state.clearAccessCode);

  const signOut = () => {
    clearAccessCode();
    navigate("/", { replace: true });
  };

  return (
    <InnerAppLayout headerTitle="Menu" className="gap-4">
      <Button as={Link} to="/encrypt">
        Encrypt Content
      </Button>

      <Button as={Link} to="/decrypt">
        Decrypt Content
      </Button>

      <Button as={Link} to="/export">
        Export Entries
      </Button>

      <Button as={Link} to="/import">
        Import Entries
      </Button>

      <Button onClick={signOut}>Sign Out</Button>

      <p className="text-center text-green-300">
        v{import.meta.env.PACKAGE_VERSION}
      </p>
    </InnerAppLayout>
  );
}
