import { useEffect, useState } from "react";
import { Search, Loader2, AlertCircle, Music2, ExternalLink, X } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { searchSpotifyTracks } from "../services/api.js";

const STORAGE_KEY = "resume_selected_track";

/**
 * Lets a visitor search Spotify's catalog and embed whatever they pick,
 * right on the page - see server/controllers/spotifyController.js for the
 * search proxy. Nobody logs into Spotify to use this: the search runs on
 * app-level credentials, and the embedded player is Spotify's own iframe,
 * which gives every visitor a 30-second preview with no login at all, and
 * full playback if they already happen to be signed into Spotify in that
 * browser (Free or Premium - Spotify Connect handles it, not this site).
 *
 * The chosen track is remembered in localStorage purely as a per-visitor
 * convenience (so reloading the page doesn't lose their pick) - it's never
 * sent anywhere or shared between visitors.
 */
export default function MusicPicker() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Restore the last pick, if any, so a reload doesn't reset the player.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSelectedTrack(JSON.parse(saved));
    } catch {
      // Corrupt or inaccessible storage shouldn't break the page.
    }
  }, []);

  // Debounce - wait for a pause in typing before actually searching, same
  // approach as the admin dashboard's submission search.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setErrorMessage("");

    searchSpotifyTracks(debouncedQuery)
      .then((result) => {
        if (cancelled) return;
        setResults(result.data || []);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.message || "Couldn't search Spotify right now."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const selectTrack = (track) => {
    setSelectedTrack(track);
    setQuery("");
    setResults([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(track));
    } catch {
      // Storage can fail (private browsing, full quota) - the player still
      // works for this page view, it just won't be remembered next time.
    }
  };

  const clearTrack = () => {
    setSelectedTrack(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // See note above.
    }
  };

  return (
    <section id="music" className="px-6 sm:px-8 py-20 sm:py-28 bg-slate-50/60 dark:bg-surface/30">
      <div className="max-w-3xl mx-auto">
        <Reveal className="mb-10">
          <p className="section-eyebrow">// Soundtrack</p>
          <h2 className="section-heading">Pick what plays while you read</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Search any track and it'll play right here - no Spotify account
            needed for a preview, full songs if you're already signed in.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="card p-6 sm:p-7">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a song or artist..."
              aria-label="Search Spotify"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-paperCard dark:bg-white/5 pl-10 pr-10 py-2.5 text-sm text-graphite dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
            />
            {status === "loading" && (
              <Loader2
                size={15}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
              />
            )}
            {status !== "loading" && query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-graphite dark:hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {status === "error" && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-red-500">
              <AlertCircle size={13} /> {errorMessage}
            </p>
          )}

          {results.length > 0 && (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-white/10 border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden">
              {results.map((track) => (
                <li key={track.id}>
                  <button
                    type="button"
                    onClick={() => selectTrack(track)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {track.image ? (
                      <img
                        src={track.image}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover shrink-0"
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-md bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Music2 size={16} className="text-slate-400" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-graphite dark:text-white truncate">
                        {track.name}
                      </span>
                      <span className="block font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                        {track.artists}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {status === "success" && debouncedQuery && results.length === 0 && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              No tracks found for "{debouncedQuery}".
            </p>
          )}

          {/* Player */}
          <div className="mt-6">
            {selectedTrack ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Now playing
                  </span>
                  <div className="flex items-center gap-3">
                    {selectedTrack.spotifyUrl && (
                      <a
                        href={selectedTrack.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-mono text-xs text-slate-400 hover:text-signal-dark dark:hover:text-signal"
                      >
                        Open in Spotify <ExternalLink size={11} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={clearTrack}
                      aria-label="Stop and clear player"
                      className="text-slate-400 hover:text-graphite dark:hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <iframe
                  key={selectedTrack.id}
                  title={`Spotify player - ${selectedTrack.name}`}
                  src={`https://open.spotify.com/embed/track/${selectedTrack.id}?utm_source=generator`}
                  width="100%"
                  height="152"
                  style={{ borderRadius: "12px", border: "none" }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </>
            ) : (
              <p className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <Music2 size={14} /> Nothing picked yet - search above to start.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
