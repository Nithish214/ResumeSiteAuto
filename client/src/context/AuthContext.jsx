import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "resume_admin_token";

/**
 * Decodes a JWT's payload WITHOUT verifying its signature - fine here
 * because this only reads the expiry time to decide whether to show the
 * login screen again; it's not used to trust the token's contents. The
 * actual signature check happens server-side on every protected request
 * (see server/middleware/auth.js) - that's the real security boundary,
 * not anything on the client.
 */
function decodeTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // exp is in seconds
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const expiryMs = decodeTokenExpiry(token);
  return expiryMs ? Date.now() >= expiryMs : true;
}

/**
 * Provides real admin authentication state, backed by a JWT issued from
 * POST /api/auth/login (see server/controllers/authController.js).
 *
 * This replaces the old approach of comparing a typed password against
 * VITE_ADMIN_PASSWORD in the browser - that value shipped in plain text
 * inside the JavaScript bundle, so it was never actually secret. Now the
 * real check happens server-side, and the browser only ever holds a
 * short-lived signed token.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored && !isTokenExpired(stored) ? stored : null;
  });

  // If the token expires while the tab is open, log out automatically
  // rather than letting API calls silently start failing with 401s.
  useEffect(() => {
    if (!token) return;
    const expiryMs = decodeTokenExpiry(token);
    if (!expiryMs) return;

    const msUntilExpiry = expiryMs - Date.now();
    const timer = setTimeout(() => logout(), Math.max(msUntilExpiry, 0));
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: Boolean(token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
