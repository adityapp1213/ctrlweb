import { loadEnvConfig } from "@next/env";
import { createClerkClient } from "@clerk/backend";
import { profileFromUser } from "../db/clerk-profile";
import { upsertClerkUser } from "../db/users";

loadEnvConfig(process.cwd());

async function main() {
  if (!process.env.CLERK_SECRET_KEY || !process.env.DATABASE_URL) {
    console.error("Add CLERK_SECRET_KEY and DATABASE_URL to .env.local before running the backfill.");
    process.exitCode = 1;
    return;
  }
  const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const dryRun = process.argv.includes("--dry-run");
  let processed = 0;
  for (let offset = 0; ; offset += 100) {
    const { data } = await client.users.getUserList({ limit: 100, offset, orderBy: "+created_at" });
    for (const user of data) {
      if (!dryRun) await upsertClerkUser(profileFromUser(user));
      processed += 1;
    }
    if (data.length < 100) break;
  }
  console.log(dryRun ? `Found ${processed} Clerk users (dry run; no writes).` : `Synchronized ${processed} Clerk users to Neon.`);
}

main().catch(() => {
  console.error("Clerk backfill failed. Check database credentials, migrations, and Clerk connectivity; rerunning is safe.");
  process.exitCode = 1;
});
