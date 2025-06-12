import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorHandler from "./components/ErrorHandler";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Download from "./pages/Download";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import SLADashboard from "./pages/SLADashboard";
import FAQPage from "./pages/FAQPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ErrorHandler>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="/sla" element={<SLADashboard />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute requiredRole="Administrador">
                              <SettingsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </div>
        </Router>
      </ErrorHandler>
    </AuthProvider>
  );
}

export default App;
