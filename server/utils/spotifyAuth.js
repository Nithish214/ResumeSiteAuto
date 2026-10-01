/**
 * Gets an app-level Spotify access token via the Client Credentials flow.
 *
 * This is NOT user login - nobody (not you, not a visitor) ever signs into
 * Spotify or sees a consent screen. It just proves this server is a
 * registered Spotify app, which is enough to search the public catalog
 * (track/artist/album metadata) - but not enough to touch anyone's
 * playlists, library, or playback, which is exactly the access this
 * feature needs and nothing more.
 *
 * Required env vars (from a Spotify Developer Dashboard app - dashboard at
 * developer.spotify.com/dashboard - no special access review needed for
 * Client Credentials):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *
 * The token is cached at module scope (same pattern as config/db.js's
 * connection caching) so a warm Lambda container reuses it across
 * invocations instead of requesting a new one on every search.
 */
let cachedToken = null;
let tokenExpiresAt = 0;

const getAppAccessToken = async () => {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "Spotify isn't configured - set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET."
    );
  }

  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Spotify token request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Refresh a minute before actual expiry so a request never starts with a
  // token that's about to (or just did) expire.
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
};

export default getAppAccessToken;
