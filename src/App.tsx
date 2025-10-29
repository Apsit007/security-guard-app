import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

// Pages
import DashboardPage from "./pages/dashboard/Dashboard";
import WorkerInfo from "./pages/worker-info/WorkerInfo";
import ManageWorker from "./pages/manage-worker/ManageWorker";
import PatrolInfo from "./pages/patrol-info/PatrolInfo";
import ManagePatrol from "./pages/manage-patrol/ManagePatrol";
import WorkplaceInfo from "./pages/workplace-info/WorkplaceInfo";
import ManageWorkSchedule from "./pages/manage-work-schedule/ManageWorkSchedule";
import ManageWorkReport from "./pages/manage-work-report/ManageWorkReport";
import Event from "./pages/event/Event";
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
        <Route path="worker-info" element={<WorkerInfo />} />
        <Route path="worker-info/manage-worker" element={<ManageWorker />} />
        <Route path="patrol-info" element={<PatrolInfo />} />
        <Route path="manage-patrol" element={<ManagePatrol />} />
        <Route path="workplace-info" element={<WorkplaceInfo />} />
        <Route path="manage-work-schedule" element={<ManageWorkSchedule />} />
        <Route path="manage-work-report" element={<ManageWorkReport />} />
        <Route path="event" element={<Event />} />
      </Route>
    </Routes>
  );
}

export default App;
