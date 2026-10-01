import getAppAccessToken from "../utils/spotifyAuth.js";

/**
 * @route   GET /api/spotify/search?q=...
 * @desc    Proxies a track search to the Spotify Web API so the client
 *          never needs its own Spotify credentials. Only returns the public
 *          fields the music picker UI actually uses (see
 *          client/src/components/MusicPicker.jsx) - not Spotify's full
 *          track object.
 * @access  Public
 */
export const searchTracks = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    const token = await getAppAccessToken();
    const params = new URLSearchParams({ q, type: "track", limit: "8" });

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Spotify search failed:", response.status, body);
      return res.status(502).json({
        success: false,
        message: "Couldn't reach Spotify right now. Please try again shortly.",
      });
    }

    const data = await response.json();
    const tracks = (data.tracks?.items || []).map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      // Smallest thumbnail Spotify returns (usually 64x64) - plenty for a
      // search result row; falls back to whatever's available.
      image: track.album.images?.[track.album.images.length - 1]?.url || null,
      spotifyUrl: track.external_urls?.spotify || null,
    }));

    res.status(200).json({ success: true, data: tracks });
  } catch (error) {
    next(error);
  }
};
