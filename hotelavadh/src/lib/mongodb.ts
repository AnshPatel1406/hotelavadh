import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder('ipv4first');

// Use a global cache to avoid multiple connections in development
// caused by Next.js HMR (Hot Module Replacement)
declare global {
  var _mongooseConn: mongoose.Connection | null;
  var _mongoosePromise: Promise<mongoose.Connection> | null;
}

let cachedConn = global._mongooseConn;
let cachedPromise = global._mongoosePromise;

if (!cachedConn) {
  cachedConn = global._mongooseConn = null;
}
if (!cachedPromise) {
  cachedPromise = global._mongoosePromise = null;
}

async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cachedConn) {
    console.log("Already connected to database (cached)");
    return cachedConn;
  }

  if (!cachedPromise) {
    const uri = process.env.MONGODB_URI as string;
    if (!uri) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    cachedPromise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log("DB Connected Successfully (new connection)");
      return mongooseInstance.connection;
    }).catch((error) => {
      console.error("Database Connection Failed:", error);
      cachedPromise = null;
      throw error;
    });

    global._mongoosePromise = cachedPromise;
  }

  try {
    cachedConn = await cachedPromise;
    global._mongooseConn = cachedConn;
    return cachedConn;
  } catch (e) {
    cachedPromise = null;
    global._mongoosePromise = null;
    throw e;
  }
}

export default connectToDatabase;