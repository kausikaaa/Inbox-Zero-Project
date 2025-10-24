import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import InboxPage from "./pages/InboxPage.jsx";
import ArchivedPage from "./pages/ArchivedPage.jsx";

// ProtectedRoute wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // JWT from login
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Always visible */}
      <div className="p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/archived"
            element={
              <ProtectedRoute>
                <ArchivedPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to inbox */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
