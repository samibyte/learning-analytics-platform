import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

interface GlobalWithMongoose {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalWithMongoose = global as GlobalWithMongoose;

// Next.js hot-reloading can cause multiple DB connections, so we cache it globally
let cached: NonNullable<GlobalWithMongoose["mongoose"]> =
  globalWithMongoose.mongoose as NonNullable<GlobalWithMongoose["mongoose"]>;

if (!cached) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
  cached = globalWithMongoose.mongoose;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
