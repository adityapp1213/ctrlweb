import type { SimulationSetup } from './panda';
import { findRobot, findScenario, robotSlug, SCENARIOS, sceneProps } from './routes';

export const EMPTY_RESEARCH_SETUP: SimulationSetup = { robotId: 'empty', environment: 'ground', props: [] };
export function researchSetup(params: { robot?: string | string[]; environment?: string | string[]; props?: string | string[] }): SimulationSetup | null {
  if (!params.robot) return { ...EMPTY_RESEARCH_SETUP, props: [] };
  if (typeof params.robot !== 'string' || (params.environment !== undefined && typeof params.environment !== 'string')) return null;
  const robot = findRobot(params.robot);
  const scenario = findScenario(params.environment || 'open-floor');
  return robot && scenario ? { robotId: robot.id, environment: scenario.id, props: sceneProps(params.props) } : null;
}
export function researchPath(setup: SimulationSetup) {
  if (setup.robotId === 'empty') return '/platform/research';
  const scenario = SCENARIOS.find((item) => item.id === setup.environment);
  if (!scenario || !findRobot(robotSlug(setup.robotId))) throw new Error('Unknown research preset');
  const params = new URLSearchParams({ robot: robotSlug(setup.robotId), environment: scenario.slug });
  if (setup.props.length) params.set('props', sceneProps(setup.props.join(',')).join(','));
  return `/platform/research?${params}`;
}
