import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let database: ReturnType<typeof createDatabase> | undefined;

function createDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required for Neon user synchronization.");
  return drizzle(neon(url), { schema });
}

// Lazy initialization keeps public routes and builds independent of the DB.
export function getDatabase() {
  return database ??= createDatabase();
}
