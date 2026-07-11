import { Link } from "react-router-dom";
import { useSiteData } from "../context/SiteDataContext.jsx";

export default function Footer() {
  const { profile, siteId } = useSiteData();
  const year = new Date().getFullYear();

  // Lets a recruiter who landed on one version discover the other -
  // "sre" links to the Java-focused resume and vice versa.
  const otherResume =
    siteId === "java"
      ? { to: "/", label: "Viewing Java resume — see Cloud Ops/SRE resume instead" }
      : { to: "/java", label: "Viewing Cloud Ops/SRE resume — see Java resume instead" };

  return (
    <footer className="px-6 sm:px-8 py-10 border-t border-slate-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
        <p>
          © {year} {profile.name}. Built with the MERN stack.
        </p>
        <Link
          to={otherResume.to}
          className="hover:text-signal-dark dark:hover:text-signal transition-colors"
        >
          {otherResume.label}
        </Link>
        <p className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-dark dark:bg-signal" />
          all systems operational
        </p>
      </div>
    </footer>
  );
}
