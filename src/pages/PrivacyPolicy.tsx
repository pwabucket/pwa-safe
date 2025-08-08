import InnerAppLayout from "../layouts/InnerAppLayout";
import MarkdownRender from "../components/MarkdownRenderer";
import privacyPolicy from "../../PRIVACY.md?raw";

export default function PrivacyPolicy() {
  return (
    <InnerAppLayout headerTitle="Privacy Policy">
      <MarkdownRender content={privacyPolicy} />
    </InnerAppLayout>
  );
}
