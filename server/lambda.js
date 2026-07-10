// Same reasoning as server.js: this must be the first import so .env is
// loaded before app.js reads process.env.CLIENT_URL. In real deployments,
// AWS injects environment variables directly (set via serverless.yml), so
// there usually won't even be a .env file present here - "dotenv/config"
// simply does nothing in that case, which is fine.
import "dotenv/config";

import serverlessHttp from "serverless-http";
import app from "./app.js";
import connectDB from "./config/db.js";

// Wrapping the app once, outside the handler, lets serverless-http's own
// internal setup be reused across warm invocations too - it doesn't need
// to run on every request.
const serverlessHandler = serverlessHttp(app);

/**
 * AWS Lambda handler. API Gateway (configured in serverless.yml) invokes
 * this function for every request instead of the app "listening" on a
 * port the way it does locally in server.js.
 */
export const handler = async (event, context) => {
  // By default, Lambda waits for the Node.js event loop to be completely
  // empty before returning a response. MongoDB's driver keeps background
  // timers/sockets open (that's what makes connection reuse on the next
  // warm invocation possible), so without this flag Lambda would hang
  // until those timers finished - or worse, close the connection we're
  // trying to keep alive.
  context.callbackWaitsForEmptyEventLoop = false;

  // Ensure we have a live MongoDB connection before handling the request.
  // On a warm container this resolves instantly (see config/db.js).
  await connectDB();

  return serverlessHandler(event, context);
};
