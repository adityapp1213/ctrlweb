import { ROBOT_CATALOG, type SimulationSetup } from './panda';
import { normalizeSceneProps } from '@/public/simulation/asset-options.mjs';

export const PLAYGROUND_PATH = '/platform/playground';
export const EXPLORE_PATH = `${PLAYGROUND_PATH}/explore`;
export const SCENARIOS = [
  { id: 'ground', slug: 'open-floor', label: 'Open floor', description: 'Inspect the arm in its original scene.', objects: ['Ground plane', 'Robot'] },
  { id: 'workbench', slug: 'workbench', label: 'Workbench', description: 'An ALOHA workbench with a calibration block.', objects: ['ALOHA table', 'Block'] },
  { id: 'sorting', slug: 'object-sorting', label: 'Object sorting', description: 'A community manipulation scene with textured objects.', objects: ['ALOHA table', 'Block', 'Can', 'Lemon', 'Bin'] },
] as const;

export const LIBRARY_SECTIONS = {
  models: { label: 'My models', description: 'Models you add will appear here.' },
  modules: { label: 'Custom modules', description: 'Your custom modules will appear here.' },
  environments: { label: 'Saved environments', description: 'Saved scenes currently live in this browser and can be loaded from the simulation’s Scene panel.' },
  tasks: { label: 'Tasks', description: 'Task collections are not available yet. Explore the robot environments in the playground.' },
} as const;

export function robotSlug(id: string) { return id.replaceAll('_', '-'); }
export function robotPath(id: string) { return `${PLAYGROUND_PATH}/${robotSlug(id)}`; }
export function findRobot(slug: string) { return ROBOT_CATALOG.find((robot) => robotSlug(robot.id) === slug); }
export function findScenario(slug: string) { return SCENARIOS.find((scenario) => scenario.slug === slug); }
export function simulationPath(setup: SimulationSetup) {
  const scenario = SCENARIOS.find((item) => item.id === setup.environment);
  if (!scenario || !ROBOT_CATALOG.some((robot) => robot.id === setup.robotId)) throw new Error('Unknown simulation route');
  const props = normalizeSceneProps(setup.props);
  return `${robotPath(setup.robotId)}/${scenario.slug}${props.length ? `?props=${props.join(',')}` : ''}`;
}
export function sceneProps(value: string | string[] | undefined) {
  return normalizeSceneProps((typeof value === 'string' ? value : '').split(','));
}
