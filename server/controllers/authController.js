import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * @route   POST /api/auth/login
 * @desc    Checks admin credentials and issues a JWT if they're correct.
 * @access  Public (this IS the login endpoint - obviously not protected)
 *
 * There's deliberately no "admin user" collection in MongoDB here - for a
 * single-admin site like this one, a full user-management system is more
 * complexity than the problem needs. Credentials instead live in
 * environment variables: ADMIN_USERNAME (plain) and ADMIN_PASSWORD_HASH
 * (bcrypt-hashed, generated once with `npm run hash-password`).
 *
 * If you ever need multiple admin accounts, that's the point where this
 * would grow into a real Admin/User model with per-user hashed passwords
 * stored in MongoDB instead.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const validUsername = username === process.env.ADMIN_USERNAME;

    // bcrypt.compare handles the timing-safe comparison itself - no need
    // to worry about timing attacks here beyond using it correctly.
    const validPassword = process.env.ADMIN_PASSWORD_HASH
      ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
      : false;

    if (!validUsername || !validPassword) {
      // Deliberately the same error for "wrong username" and "wrong
      // password" - revealing which one was wrong helps an attacker
      // narrow down valid usernames.
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
