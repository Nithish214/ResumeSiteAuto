import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Clock,
  AlertCircle,
  Trash2,
  Loader2,
  Search,
  LogOut,
  User,
} from "lucide-react";
import { fetchContacts, deleteContact as deleteContactRequest, loginAdmin } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

/**
 * Real admin login form - submits to POST /api/auth/login (see
 * server/controllers/authController.js) and stores the returned JWT via
 * AuthContext. This replaces the old client-side-only password check,
 * which never actually protected the API - anyone could call
 * GET /api/contacts directly and get every submission regardless of what
 * this page showed. The real check now happens server-side on every
 * protected request (see server/middleware/auth.js).
 */
function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const result = await loginAdmin(username, password);
      login(result.token);
    } catch (err) {
      setStatus("error");
      setError(
        err?.response?.data?.message || "Couldn't log in. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-sm space-y-5"
      >
        <div className="flex items-center gap-2 text-graphite dark:text-white">
          <Lock size={18} className="text-signal-dark dark:text-signal" />
          <h1 className="font-display text-lg font-bold">Admin Access</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Log in to view recruiter submissions.
        </p>

        <div>
          <label htmlFor="admin-username" className="sr-only">
            Username
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
              autoComplete="username"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-paperCard dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-graphite dark:text-white focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-paperCard dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-graphite dark:text-white focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
            />
          </div>
          {status === "error" && (
            <p role="alert" className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </div>
  );
}

function ContactCard({ contact, onDelete, isDeleting }) {
  const submittedDate = new Date(contact.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      `Delete the submission from ${contact.recruiterName} (${contact.companyName})? This can't be undone.`
    );
    if (confirmed) {
      onDelete(contact._id);
    }
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-display font-semibold text-graphite dark:text-white">
            {contact.recruiterName}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Building2 size={14} /> {contact.companyName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Clock size={12} /> {submittedDate}
          </span>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            aria-label={`Delete submission from ${contact.recruiterName}`}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10
                       text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/40
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-slate-500 dark:text-slate-400 mb-3">
        <a href={`mailto:${contact.workEmail}`} className="flex items-center gap-1.5 hover:text-signal-dark dark:hover:text-signal">
          <Mail size={13} /> {contact.workEmail}
        </a>
        <a href={`tel:${contact.phoneNumber}`} className="flex items-center gap-1.5 hover:text-signal-dark dark:hover:text-signal">
          <Phone size={13} /> {contact.phoneNumber}
        </a>
        <span className="flex items-center gap-1.5">
          <Briefcase size={13} /> {contact.jobTitle}
        </span>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
        {contact.message}
      </p>

      {contact.preferredCallbackTime && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preferred callback: {contact.preferredCallbackTime}
        </p>
      )}
    </div>
  );
}

function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const loadContacts = useCallback(
    async (searchTerm = search) => {
      setStatus("loading");
      try {
        const result = await fetchContacts(token, searchTerm);
        setContacts(result.data || []);
        setStatus("success");
      } catch (err) {
        // A 401 here means the token was rejected (expired or invalid) -
        // send the user back to the login screen rather than showing a
        // confusing "couldn't load" error.
        if (err?.response?.status === 401) {
          logout();
          return;
        }
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.message ||
            "Couldn't load submissions. Is the backend server running?"
        );
      }
    },
    [token, search, logout]
  );

  // Debounce search - wait 400ms after the user stops typing before
  // actually hitting the API, so every keystroke doesn't fire a request.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadContacts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    setDeleteError("");
    setDeletingId(id);
    try {
      await deleteContactRequest(id, token);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
        return;
      }
      setDeleteError(
        err?.response?.data?.message || "Couldn't delete that submission. Try again."
      );
    } finally {
      setDeletingId(null);
    }
  };
const handleLogoutClick = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-paper dark:bg-ink px-6 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            {/* <p className="section-eyebrow">// Admin</p> */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-graphite dark:text-white">
              Recruiter Submissions
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => loadContacts()} className="btn-secondary !px-4 !py-2">
              <RefreshCw size={15} className={status === "loading" ? "animate-spin" : ""} />
              Refresh
            </button>
            <button onClick={handleLogoutClick} className="btn-secondary !px-4 !py-2">
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, company, email, or role..."
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-paperCard dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-graphite dark:text-white focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
          />
        </div>

        {status === "loading" && (
          <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
            Loading submissions...
          </p>
        )}

        {status === "error" && (
          <p role="alert" className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle size={16} /> {errorMessage}
          </p>
        )}

        {deleteError && (
          <p role="alert" className="flex items-center gap-2 text-sm text-red-500 mb-4">
            <AlertCircle size={16} /> {deleteError}
          </p>
        )}

        {status === "success" && contacts.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search
              ? `No submissions match "${search}".`
              : "No submissions yet - they'll show up here as soon as someone uses the contact form."}
          </p>
        )}

        {status === "success" && contacts.length > 0 && (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                onDelete={handleDelete}
                isDeleting={deletingId === contact._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
}
