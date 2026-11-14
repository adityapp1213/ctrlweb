import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import ResearchWorkspace from '@/components/simulation/research-workspace';
import { researchSetup } from '@/lib/simulation/research';

export const metadata: Metadata = { title: 'Research workspace' };

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ robot?: string | string[]; environment?: string | string[]; props?: string | string[] }> }) {
  await auth.protect();
  const setup = researchSetup(await searchParams);
  if (!setup) notFound();
  return <ResearchWorkspace setup={setup} />;
}
