import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";
import {
  contactValidationRules,
  runValidation,
} from "../middleware/validateContact.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/contacts - submit the recruiter contact form
// Validation middleware runs first; the controller only ever sees clean data.
// Deliberately public - this is the form recruiters fill in.
router.post("/", contactValidationRules, runValidation, createContact);

// Everything below is admin-only. Previously these had NO server-side auth
// check at all - the old admin page's password gate was purely cosmetic on
// the frontend, so anyone who found the API URL could read or delete every
// submission directly. verifyToken closes that gap for real.

// GET /api/contacts - list all submissions
router.get("/", verifyToken, getContacts);

// GET /api/contacts/:id - fetch a single submission
router.get("/:id", verifyToken, getContactById);

// DELETE /api/contacts/:id - remove a single submission
router.delete("/:id", verifyToken, deleteContact);

export default router;

