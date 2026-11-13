import { ROBOT_CATALOG } from './panda';
import previews from '@/public/previews/manifest.json';
export { SCENARIOS as SCENARIO_GALLERY } from './routes';

export const ROBOT_GALLERY = ROBOT_CATALOG.map((robot) => {
  const preview = previews.find((image) => image.robotId === robot.id);
  if (!preview) throw new Error(`Missing published preview for ${robot.id}`);
  return { ...robot, preview, paired: /duo|wxai/.test(robot.id) };
});

