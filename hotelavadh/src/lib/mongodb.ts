// import mongoose from "mongoose";

// type MongooseCache = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };

// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongoose: MongooseCache | undefined;
//     }
//   }
// }

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// type MongooseCache = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };

// const cached = (global.mongoose || { conn: null, promise: null }) as MongooseCache;

// global.mongoose = cached;

// export async function connectToDatabase() {
//   if (cached.conn) {
    // return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//       strictQuery: true,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
}
