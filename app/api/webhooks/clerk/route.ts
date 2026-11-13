import type { NextRequest } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { profileFromEvent } from "@/db/clerk-profile";
import { deleteClerkUser, upsertClerkUser } from "@/db/users";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return new Response("Webhook signing secret is not configured", { status: 503 });
  }

  let event: WebhookEvent;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await upsertClerkUser(profileFromEvent(event.data));
        break;
      case "user.deleted":
        if (!event.data.id) return new Response("Missing user ID", { status: 400 });
        await deleteClerkUser(event.data.id, event.timestamp);
        break;
    }
  } catch {
    // Return a failure so Clerk retries; don't log profile data or SQL parameters.
    console.error("Clerk user synchronization failed; webhook delivery should be retried.");
    return new Response("User synchronization failed", { status: 500 });
  }
  return new Response("OK", { status: 200 });
}
