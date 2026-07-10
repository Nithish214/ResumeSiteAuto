import jwt from "jsonwebtoken";

/**
 * Protects a route so it only runs for requests carrying a valid admin JWT.
 *
 * Expects an "Authorization: Bearer <token>" header. If the token is
 * missing, malformed, or expired, the request is rejected with 401 before
 * it ever reaches the actual route handler.
 *
 * This replaces the old client-side-only password check in Admin.jsx,
 * which never actually protected anything server-side - anyone could call
 * GET /api/contacts directly (e.g. with curl) and get every submission,
 * regardless of what the frontend showed. This middleware closes that gap.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Available to any handler downstream, e.g. req.admin.username
    req.admin = decoded;
    next();
  } catch (error) {
    // Covers both an invalid signature and an expired token
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
