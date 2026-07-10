import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

/**
 * Builds and returns the Express app itself - no app.listen(), no DB
 * connection, no dotenv loading. Those are the responsibility of whichever
 * entry point imports this file:
 *   - server.js  -> runs this locally with app.listen() (npm run dev)
 *   - lambda.js  -> wraps this with serverless-http for AWS Lambda
 *
 * Keeping the app definition separate from "how it's run" is what makes
 * the exact same routes/middleware/validation work identically in both
 * environments.
 */
const app = express();

// --- Core middleware -------------------------------------------------

// Allow the React frontend to call this API from a different origin.
// Without this, browsers block the request due to CORS policy.
// NOTE: CORS is handled entirely here (not in API Gateway) so behaviour is
// identical whether you're running locally or deployed to Lambda.
//
// CLIENT_URL can be a single origin or a comma-separated list, e.g.:
//   CLIENT_URL=http://localhost:5173,https://nithishnarravula.dev
// This lets the deployed Lambda accept requests from your local dev server
// AND your production domain at the same time, so you don't need to
// redeploy every time you switch between testing locally and checking the
// live site.
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow tools with no Origin header at all (curl, Postman, server-to-
      // server calls) - only browsers send/enforce the Origin header, so
      // this doesn't weaken protection against real cross-site requests.
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${requestOrigin} not allowed by CORS`));
      }
    },
  })
);

// Parse incoming JSON request bodies into req.body
app.use(express.json());

// --- Routes ------------------------------------------------------------

app.get("/", (req, res) => {
  res.json({ message: "Resume website API is running" });
});

// Everything under /api/contacts is handled by routes/contactRoutes.js
app.use("/api/contacts", contactRoutes);

// POST /api/auth/login - admin login, issues a JWT
app.use("/api/auth", authRoutes);

// --- Error handling (must be registered last) --------------------------

app.use(notFound);
app.use(errorHandler);

export default app;
