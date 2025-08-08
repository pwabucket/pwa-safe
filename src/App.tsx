import { Route, Routes } from "react-router";

import CreateAccessCode from "./pages/CreateAccessCode";
import Dashboard from "./pages/Dashboard";
import DecryptContent from "./pages/DecryptContent";
import EncryptContent from "./pages/EncryptContent";
import EntryCreation from "./pages/EntryCreation";
import EntryDecryption from "./pages/EntryDecryption";
import EntryUpdate from "./pages/EntryUpdate";
import Menu from "./pages/Menu";
import ProtectedRoute from "./routes/ProtectedRoute";
import Welcome from "./pages/Welcome";
import useInactivity from "./hooks/useInactivity";

const INACTIVITY_DURATION = 3 * 60 * 1000;

function App() {
  useInactivity(INACTIVITY_DURATION);

  return (
    <>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/create-access-code" element={<CreateAccessCode />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/encrypt" element={<EncryptContent />} />
          <Route path="/decrypt" element={<DecryptContent />} />
          <Route path="/entries/create" element={<EntryCreation />} />
          <Route path="/entries/:id" element={<EntryDecryption />} />
          <Route path="/entries/:id/update" element={<EntryUpdate />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
