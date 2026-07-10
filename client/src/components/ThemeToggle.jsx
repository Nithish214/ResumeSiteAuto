import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * Animated sliding switch for light/dark mode - upgraded from the original
 * plain icon button. The thumb slides via a spring animation and the icon
 * crossfades, instead of just instantly swapping.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="relative h-8 w-[3.75rem] shrink-0 rounded-full border
                 border-slate-300 dark:border-white/15
                 bg-slate-100 dark:bg-white/5
                 transition-colors duration-300 flex items-center px-1"
    >
      <motion.span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-ink shadow-soft"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={13} className="text-signal" />
          ) : (
            <Sun size={13} className="text-amber-dark" />
          )}
        </motion.span>
      </motion.span>
    </button>
  );
}
