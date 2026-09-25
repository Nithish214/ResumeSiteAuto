import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";
import * as javaData from "./data/javaResumeData.js";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <SiteDataProvider data={javaData} siteId="java">
              <Home />
            </SiteDataProvider>
          }
        />
        {/* Old /java links (e.g. on a shared resume) keep working */}
        <Route path="/java" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AuthProvider>
  );
}
