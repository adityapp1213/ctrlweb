// Official Menagerie Panda model; see public/models/franka-emika-panda/LICENSE.
import catalog from '@/public/simulation/robot-catalog.json';
export const ROBOT_CATALOG = catalog;
export type SimulationSetup = { robotId: string; environment: string; props: string[] };
export type RobotControl = {
  id: number;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  home: number;
  unit: string;
  mode: string;
};
