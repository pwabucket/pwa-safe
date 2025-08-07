import { Route, Routes } from "react-router";

import CreateAccessCode from "./pages/CreateAccessCode";
import CreateEntry from "./pages/CreateEntry";
import Dashboard from "./pages/Dashboard";
import DecryptContent from "./pages/DecryptContent";
import EncryptContent from "./pages/EncryptContent";
import EntryDecrypt from "./pages/EntryDecrypt";
import Menu from "./pages/Menu";
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
          <Route path="/menu" element={<Menu />} />
          <Route path="/encrypt" element={<EncryptContent />} />
          <Route path="/decrypt" element={<DecryptContent />} />
          <Route path="/entries/create" element={<CreateEntry />} />
          <Route path="/entries/:id" element={<EntryDecrypt />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
