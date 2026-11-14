import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import PlaygroundBrowser from '@/components/simulation/playground-browser';

export const metadata: Metadata = { title: 'Explore · Playground' };

export default async function ExplorePage() {
  await auth.protect();
  return <PlaygroundBrowser />;
}
