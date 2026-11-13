import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import PlaygroundBrowser from '@/components/simulation/playground-browser';
import { findRobot } from '@/lib/simulation/routes';

type Props = { params: Promise<{ robot: string }> };

export async function generateMetadata({ params }: Props) {
  const robot = findRobot((await params).robot);
  return { title: robot ? `${robot.label} · Playground` : 'Robot not found' };
}

export default async function RobotPage({ params }: Props) {
  await auth.protect();
  const robot = findRobot((await params).robot);
  if (!robot) notFound();
  return <PlaygroundBrowser robotId={robot.id} />;
}
