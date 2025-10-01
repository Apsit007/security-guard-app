import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
