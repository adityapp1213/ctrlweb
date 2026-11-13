import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import SimulationSession from '@/components/simulation/simulation-session';
import { findRobot, findScenario, sceneProps } from '@/lib/simulation/routes';

type Props = {
  params: Promise<{ robot: string; scenario: string }>;
  searchParams: Promise<{ props?: string | string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const route = await params;
  const robot = findRobot(route.robot);
  const scenario = findScenario(route.scenario);
  return { title: robot && scenario ? `${robot.label} · ${scenario.label}` : 'Simulation not found' };
}

export default async function SimulationPage({ params, searchParams }: Props) {
  await auth.protect();
  const route = await params;
  const robot = findRobot(route.robot);
  const scenario = findScenario(route.scenario);
  if (!robot || !scenario) notFound();
  return <SimulationSession setup={{ robotId: robot.id, environment: scenario.id, props: sceneProps((await searchParams).props) }} />;
}
