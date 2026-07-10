import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login - the only auth route needed for a single-admin site
router.post("/login", login);

export default router;
