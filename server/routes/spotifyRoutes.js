import express from "express";
import rateLimit from "express-rate-limit";
import { searchTracks } from "../controllers/spotifyController.js";

const router = express.Router();

// This endpoint proxies to Spotify using OUR app's shared API quota - every
// visitor's search counts against the same allowance. Without a limit, one
// visitor (or a bot) typing quickly - or deliberately hammering the route -
// could burn through it for everyone else. 20 searches/minute per IP is
// generous for a human typing in a search box.
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many searches - wait a moment and try again." },
});

// GET /api/spotify/search?q=... - public track search for the music picker
router.get("/search", searchLimiter, searchTracks);

export default router;
