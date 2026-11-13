import "server-only";
import { and, isNull, lte } from "drizzle-orm";
import { getDatabase } from "./index";
import type { ClerkProfile } from "./clerk-profile";
import { users } from "./schema";

export async function upsertClerkUser(profile: ClerkProfile) {
  return getDatabase().insert(users).values(profile).onConflictDoUpdate({
    target: users.clerkId,
    set: { ...profile, syncedAt: new Date() },
    // A retry or old event must not overwrite a newer profile or undo deletion.
    setWhere: and(isNull(users.deletedAt), lte(users.clerkUpdatedAt, profile.clerkUpdatedAt)),
  });
}

export async function deleteClerkUser(clerkId: string, timestamp: number) {
  const deletedAt = new Date(timestamp);
  return getDatabase().insert(users).values({ clerkId, clerkUpdatedAt: timestamp, deletedAt }).onConflictDoUpdate({
    target: users.clerkId,
    set: {
      email: null, firstName: null, lastName: null, username: null, imageUrl: null,
      clerkCreatedAt: null, clerkUpdatedAt: timestamp, deletedAt, syncedAt: new Date(),
    },
  });
}
