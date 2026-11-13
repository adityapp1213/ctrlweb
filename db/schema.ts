import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Clerk IDs remain the identity key for future models, scenes, and runs.
export const users = pgTable("users", {
  clerkId: text("clerk_id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  imageUrl: text("image_url"),
  clerkCreatedAt: timestamp("clerk_created_at", { withTimezone: true }),
  clerkUpdatedAt: bigint("clerk_updated_at", { mode: "number" }).notNull(),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  // Keep only the ID and deletion time to reject late/replayed profile events.
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
