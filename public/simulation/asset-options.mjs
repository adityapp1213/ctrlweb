export const SCENE_ASSETS = [
  { id: 'table', label: 'ALOHA workbench', source: 'MuJoCo Menagerie' },
  { id: 'block', label: 'Calibration block', source: 'MuJoCo Menagerie' },
  { id: 'can', label: 'Soda can', source: 'robosuite' },
  { id: 'lemon', label: 'Lemon', source: 'robosuite' },
  { id: 'bin', label: 'Sorting bin', source: 'robosuite' },
];

export function normalizeSceneProps(values) {
  const aliases = { sphere: 'lemon', tray: 'bin' };
  return [...new Set(values.map((value) => aliases[value] || value))].filter((value) => SCENE_ASSETS.some((asset) => asset.id === value)).sort();
}
