import { Route, Routes } from "react-router";

import Welcome from "./pages/Welcome";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Welcome />} />
      </Routes>
    </>
  );
}

export default App;
