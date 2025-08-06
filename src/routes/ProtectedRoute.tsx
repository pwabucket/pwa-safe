import { Navigate, Outlet } from "react-router";

import useIsLoggedIn from "../hooks/useIsLoggedIn";

export default function ProtectedRoute() {
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
