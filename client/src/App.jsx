import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import InboxPage from "./pages/InboxPage.jsx";
import ArchivedPage from "./pages/ArchivedPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<InboxPage />} />
      <Route path="/archived" element={<ArchivedPage />} />
    </Routes>
  );
}

export default App;
