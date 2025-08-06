import { Route, Routes } from "react-router";

import CreateAccessCode from "./pages/CreateAccessCode";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/create-access-code" element={<CreateAccessCode />} />
      </Routes>
    </>
  );
}

export default App;
