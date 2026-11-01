import "server-only";
import mongoose from "mongoose";
import { env } from "@/server/config/env";
// Register referenced models before any populate() operation.
import "@/server/modules/user/user.model";
import "@/server/modules/tenant/tenant.model";
import "@/server/modules/landlord/landlord.model";
import "@/server/modules/property/property.model";
import "@/server/modules/visit/visit.model";

type ConnectionCache = { promise: Promise<typeof mongoose> | null };
const globalWithMongo = globalThis as typeof globalThis & { talaashMongo?: ConnectionCache };
const cache = globalWithMongo.talaashMongo ??= { promise: null };

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!cache.promise) {
    cache.promise = mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .finally(() => { cache.promise = null; });
  }
  return cache.promise;
}
