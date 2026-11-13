import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { PLAYGROUND_PATH } from '@/lib/simulation/routes';

export default async function PlatformPage() {
  await auth.protect();

  redirect(PLAYGROUND_PATH);
}
