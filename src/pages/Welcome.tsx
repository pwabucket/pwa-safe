import { useNavigate } from "react-router";
import Auth from "../components/Auth";
import useAppStore from "../store/useAppStore";

function Welcome() {
  const navigate = useNavigate();
  const setDecryptedAccessCode = useAppStore(
    (state) => state.setDecryptedAccessCode
  );
  const handleSuccessfulLogin = (verifiedCode: string | null) => {
    if (verifiedCode !== null) {
      setDecryptedAccessCode(verifiedCode);
    }
    navigate("/dashboard", { replace: true });
  };

  return <Auth onSuccessfulLogin={handleSuccessfulLogin} />;
}

export default Welcome;
