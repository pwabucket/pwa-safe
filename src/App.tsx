import { Route, Routes } from "react-router";

import CreateAccessCode from "./pages/CreateAccessCode";
import Dashboard from "./pages/Dashboard";
import DecryptContent from "./pages/DecryptContent";
import EncryptContent from "./pages/EncryptContent";
import EntryCreation from "./pages/EntryCreation";
import EntryDecryption from "./pages/EntryDecryption";
import EntryUpdate from "./pages/EntryUpdate";
import Export from "./pages/Export";
import Import from "./pages/Import";
import Menu from "./pages/Menu";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./routes/ProtectedRoute";
import TermsOfUse from "./pages/TermsOfUse";
import UpdateAccessCode from "./pages/UpdateAccessCode";
import Welcome from "./pages/Welcome";
import useInactivity from "./hooks/useInactivity";

const INACTIVITY_DURATION = 3 * 60 * 1000;

function App() {
  useInactivity(INACTIVITY_DURATION);

  return (
    <>
      <Routes>
        <Route index element={<Welcome />} />
        {/* Privacy Policy */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />

        {/* Terms of Use*/}
        <Route path="terms-of-use" element={<TermsOfUse />} />

        <Route path="/create-access-code" element={<CreateAccessCode />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/export" element={<Export />} />
          <Route path="/import" element={<Import />} />
          <Route path="/encrypt" element={<EncryptContent />} />
          <Route path="/decrypt" element={<DecryptContent />} />
          <Route path="/entries/create" element={<EntryCreation />} />
          <Route path="/entries/:id" element={<EntryDecryption />} />
          <Route path="/entries/:id/update" element={<EntryUpdate />} />

          <Route path="/update-access-code" element={<UpdateAccessCode />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
