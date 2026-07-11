import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SiteDataProvider } from "./context/SiteDataContext.jsx";
import * as sreData from "./data/resumeData.js";
import * as javaData from "./data/javaResumeData.js";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <SiteDataProvider data={sreData} siteId="sre">
              <Home />
            </SiteDataProvider>
          }
        />
        <Route
          path="/java"
          element={
            <SiteDataProvider data={javaData} siteId="java">
              <Home />
            </SiteDataProvider>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AuthProvider>
  );
}
