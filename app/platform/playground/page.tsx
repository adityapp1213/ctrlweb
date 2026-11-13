import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import PlaygroundBrowser from '@/components/simulation/playground-browser';

export const metadata: Metadata = { title: 'Playground' };

export default async function PlaygroundPage() {
  await auth.protect();
  return <PlaygroundBrowser />;
}
