// IMPORTANT: this must be the very first import. In ES modules, all static
// imports are evaluated before any other code in this file runs - so if
// dotenv.config() were called as a normal statement below other imports,
// app.js would already have read process.env.CLIENT_URL (undefined) by the
// time .env was loaded. "dotenv/config" loads .env as a side effect at
// import time, which - because it's the first import - runs before app.js
// is evaluated.
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

/**
 * Local/traditional server entry point: connect to MongoDB once, then keep
 * an Express server listening for the life of the process. This is what
 * `npm run dev` runs. AWS Lambda uses lambda.js instead - see that file for
 * why a long-running app.listen() doesn't fit the Lambda model.
 */
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
