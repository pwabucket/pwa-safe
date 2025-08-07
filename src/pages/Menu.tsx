import { Link } from "react-router";

import Button from "../components/Button";
import InnerAppLayout from "../layouts/InnerAppLayout";

export default function Menu() {
  return (
    <InnerAppLayout headerTitle="Menu" className="gap-4">
      <Button as={Link} to="/encrypt">
        Encrypt Content
      </Button>

      <Button as={Link} to="/decrypt">
        Decrypt Content
      </Button>
    </InnerAppLayout>
  );
}
