import { useNavigate } from "react-router";
import Auth from "../components/Auth";

function Welcome() {
  const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    navigate("/dashboard", { replace: true });
  };

  return <Auth onSuccessfulLogin={handleSuccessfulLogin} />;
}

export default Welcome;
