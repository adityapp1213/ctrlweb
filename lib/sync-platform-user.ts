import "server-only";
import { clerkClient } from "@clerk/nextjs/server";
import { cache } from "react";
import { profileFromUser } from "@/db/clerk-profile";
import { upsertClerkUser } from "@/db/users";

// Call only with the userId returned by server-side auth.protect().
export const syncPlatformUser = cache(async (userId: string) => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await upsertClerkUser(profileFromUser(user));
});
