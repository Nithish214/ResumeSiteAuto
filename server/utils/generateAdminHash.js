import bcrypt from "bcryptjs";

/**
 * Run this once to generate the value for ADMIN_PASSWORD_HASH in .env.
 *
 * Usage:
 *   npm run hash-password -- YourRealPasswordHere
 *
 * This prints a bcrypt hash - paste that (the whole thing, starting with
 * $2a$ or $2b$) into server/.env as ADMIN_PASSWORD_HASH. The plain-text
 * password itself is never stored anywhere - only this hash is, so even
 * someone with access to your .env file can't read the original password
 * back out of it.
 */
const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- YourPasswordHere");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log("\nAdd this line to server/.env:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
