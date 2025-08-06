import { Route, Routes } from "react-router";

import CreateAccessCode from "./pages/CreateAccessCode";
import CreateEntry from "./pages/CreateEntry";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/create-access-code" element={<CreateAccessCode />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entries/create" element={<CreateEntry />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
