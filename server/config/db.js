import mongoose from "mongoose";

/**
 * Connects to MongoDB, reusing the existing connection when one is already
 * open or in progress.
 *
 * Why this matters for Lambda specifically: a "warm" Lambda container
 * reuses the same Node.js process (and therefore the same module-level
 * state) across multiple invocations. Without this caching, every single
 * request would open a brand new MongoDB connection and never close it,
 * quickly exhausting your connection pool. Checking readyState first means
 * a warm invocation just reuses the connection from the previous one.
 *
 * This same function also works unchanged for the local server (server.js),
 * which simply calls it once at startup.
 */
let connectionPromise = null;

const connectDB = async () => {
  // 1 = connected, already good to go
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    // Fail fast instead of buffering queries indefinitely if we're not
    // connected - important in Lambda, where a hung query just burns
    // billed execution time instead of erroring out quickly.
    mongoose.set("bufferCommands", false);

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    await connectionPromise;
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    // Let the next invocation/request try again from a clean slate instead
    // of getting stuck retrying a promise that's already failed.
    connectionPromise = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
