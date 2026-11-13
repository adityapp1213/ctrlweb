import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';

export const metadata: Metadata = { title: 'Research workspace' };

export default async function ResearchPage() {
  await auth.protect();
  return null;
}
