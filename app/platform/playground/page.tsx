import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PlaygroundHome from '@/components/simulation/playground-home';
import { EXPLORE_PATH } from '@/lib/simulation/routes';

export const metadata: Metadata = { title: 'Playground' };

export default async function PlaygroundPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  await auth.protect();
  const filters = await searchParams;
  const query = new URLSearchParams();
  for (const key of ['arms', 'environment', 'q']) {
    const value = filters?.[key];
    if (typeof value === 'string' && value) query.set(key, value);
  }
  if (query.size) redirect(`${EXPLORE_PATH}?${query}`);
  return <PlaygroundHome />;
}
