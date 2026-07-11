import { createContext, useContext } from "react";

const SiteDataContext = createContext(null);

/**
 * Wraps a route with the resume dataset that should be active for it - see
 * App.jsx, where "/" gets resumeData.js and "/java" gets javaResumeData.js.
 * Every content component (Hero, About, Experience, etc.) reads from this
 * via useSiteData() instead of importing a data file directly, so the same
 * components render either resume depending on which route loaded them.
 *
 * `siteId` is a short tag ("sre" | "java") carried along on contact form
 * submissions (see components/Contact.jsx) so the admin dashboard can show
 * which resume a recruiter was viewing when they got in touch.
 */
export function SiteDataProvider({ data, siteId, children }) {
  return (
    <SiteDataContext.Provider value={{ ...data, siteId }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
}
