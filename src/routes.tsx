import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./views";
import { useAuth } from "./hooks";
import {
  DashboardPage,
  DashboardHome,
} from "./views/Dashboard";
import MasterHS from "./views/Dashboard/MasterHS/MasterHSView";
import BC30 from "./views/Dashboard/PEB/BC30View";
import BC23 from "./views/Dashboard/TPB/BC23View";
import BC25 from "./views/Dashboard/TPB/BC25View";
import BC261 from "./views/Dashboard/TPB/BC261View";
import BC262 from "./views/Dashboard/TPB/BC262View";
import BC27Out from "./views/Dashboard/TPB/BC27OutView";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardHome />} />
        <Route path="masterHs" element={<MasterHS />} />
        
        <Route path="peb/bc30" element={<BC30 />} />

        <Route path="tpb/bc23" element={<BC23 />} />
        <Route path="tpb/bc25" element={<BC25 />} />
        <Route path="tpb/bc261" element={<BC261 />} />
        <Route path="tpb/bc262" element={<BC262 />} />
        <Route path="tpb/bc27out" element={<BC27Out />} />
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
