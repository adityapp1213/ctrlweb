import { normalizeSceneProps } from './asset-options.mjs';

export const ENVIRONMENTS = [
  { id: 'ground', label: 'Open floor', props: [] },
  { id: 'workbench', label: 'Workbench', props: ['table', 'block'] },
  { id: 'sorting', label: 'Object sorting', props: ['table', 'block', 'can', 'lemon', 'bin'] },
];

const decode = (file) => new TextDecoder().decode(file.bytes);
const assetRoot = 'environment/robosuite/robosuite/models/assets/';
function getSource(assets, suffix) {
  const file = assets.find((item) => item.name.endsWith(suffix));
  if (!file) throw new Error('Missing community asset: ' + suffix);
  return file;
}
function inner(xml, tag) { return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] || ''; }
function resolveFile(file, relative) {
  const parts = file.split('/').slice(0, -1);
  for (const part of relative.split('/')) { if (part === '..') parts.pop(); else if (part !== '.') parts.push(part); }
  return '/robot/' + parts.join('/');
}
function namespace(xml, prefix) {
  return xml.replace(/\b(name|mesh|material|texture)="([^"]+)"/g, (_, key, value) => `${key}="${prefix}${value}"`);
}
function componentAssets(file, prefix) {
  return namespace(inner(decode(file), 'asset').replace(/file="([^"]+)"/g, (_, relative) => `file="${resolveFile(file.name, relative)}"`), prefix);
}

// Reuse original meshes, UVs, textures, collider definitions and object sizes.
// Only assembly transforms / parameterized fixture dimensions are configured.
/** @param {{name: string, bytes: Uint8Array}[]} files
 * @param {string} entry
 * @param {string} environment
 * @param {string[]} extras
 * @param {{assets?: {name: string, bytes: Uint8Array}[], profile?: {nativeTable: boolean, floorZ: number, tableLength: number, tableWidth: number, center: number[], objectX: number, objectY: number, reach: number}, robotId?: string}} options
 */
export function composeScene(files, entry, environment, extras = [], { assets = [], profile, robotId = '' } = {}) {
  const preset = ENVIRONMENTS.find((item) => item.id === environment) ?? ENVIRONMENTS[0];
  const props = normalizeSceneProps([...preset.props, ...extras]);
  const scene = files.find((file) => file.name === entry);
  if (!scene) throw new Error('The original scene file is missing.');
  let xml = decode(scene);
  if (robotId === 'kinova_gen3') {
    // These mechanically joined base/shoulder shells overlap in the source.
    // The usual parent filter omits this case because the base is world-welded.
    xml = xml.replace('</mujoco>', '<contact><exclude body1="base_link" body2="shoulder_link"/></contact></mujoco>');
  }
  if (!props.length) return files.map((file) => file === scene ? { ...file, bytes: new TextEncoder().encode(xml) } : file);
  if (!profile) throw new Error('The robot workspace calibration is missing.');
  const table = props.includes('table') || profile.nativeTable;
  const top = table ? -.0009 : profile.floorZ;
  const world = [];
  const assetXml = [];
  if (props.includes('table') && !profile.nativeTable) {
    const original = decode(getSource(assets, 'menagerie/aloha/scene.xml'));
    // ALOHA's physical table is 1.21 x .76 x .75 m. XY variants accommodate
    // compact bench arms and larger industrial arms; robot dimensions stay real.
    const scale = `${profile.tableWidth / .76} ${profile.tableLength / 1.21} 1`;
    for (const name of ['tabletop', 'tablelegs']) assetXml.push(`<mesh name="env_${name}" file="/robot/environment/menagerie/aloha/assets/${name}.obj" scale="${scale}"/>`);
    assetXml.push('<texture name="env_table_texture" type="2d" file="/robot/environment/menagerie/aloha/assets/small_meta_table_diffuse.png"/><material name="env_table_material" texture="env_table_texture"/>');
    const visuals = original.match(/<geom[^>]*mesh="table(?:top|legs)"[^>]*\/>/g);
    if (visuals?.length !== 2) throw new Error('The upstream ALOHA table definition changed.');
    const collision = original.match(/<geom name="table"[^>]*\/>/)?.[0];
    if (!collision) throw new Error('The upstream ALOHA table collider is missing.');
    world.push(`<body name="env_workbench" pos="${profile.center.join(' ')} 0">` +
      visuals.map((geom) => geom.replace(/class="visual"/, 'type="mesh" contype="0" conaffinity="0" group="2"').replace(/mesh="(tabletop|tablelegs)"/, 'mesh="env_$1"').replace('material="table"', 'material="env_table_material"')).join('\n') +
      collision.replace('name="table"', 'name="env_table_collision"').replace('class="collision"', 'group="3"').replace(/size="[^"]+"/, `size="${profile.tableLength / 2} ${profile.tableWidth / 2} 0.1"`) + '</body>');
  }
  const x = profile.objectX;
  const y = profile.objectY;
  const spread = Math.min(.12, profile.reach * .12);
  if (props.includes('block')) {
    const original = decode(getSource(assets, 'menagerie/franka_emika_panda/mjx_single_cube.xml'));
    const block = original.match(/<body name="box"[\s\S]*?<\/body>/)?.[0];
    if (!block) throw new Error('The upstream calibration block is missing.');
    world.push(namespace(block, 'env_').replace(/pos="[^"]+"/, `pos="${x} ${y + spread} ${top + .035}"`).replace('conaffinity="1"', 'conaffinity="3"'));
  }
  for (const [id, offset, bottom] of [['can', 0, .06], ['lemon', -spread, .035]]) {
    if (!props.includes(id)) continue;
    const file = getSource(assets, `${assetRoot}objects/${id}.xml`);
    assetXml.push(componentAssets(file, `env_${id}_`));
    const body = inner(decode(file), 'worldbody').match(/<body name="object">([\s\S]*?)<\/body>/)?.[1];
    if (!body) throw new Error('The upstream object body is missing: ' + id);
    world.push(`<body name="env_${id}" pos="${x} ${y + offset} ${top + bottom + .005}"><freejoint/>${namespace(body, `env_${id}_`)}</body>`);
  }
  if (props.includes('bin')) {
    const file = getSource(assets, `${assetRoot}arenas/bins_arena.xml`);
    const original = decode(file);
    // Robosuite's bin1 component, without its standalone support legs.
    let body = original.match(/<body name="bin1"[\s\S]*?<\/body>/)?.[0];
    if (!body) throw new Error('The upstream sorting bin is missing.');
    const wood = inner(original, 'asset').split('\n').filter((line) => /name="tex-light-wood"|name="light-wood"/.test(line)).join('\n');
    assetXml.push(namespace(wood.replace(/file="([^"]+)"/g, (_, relative) => `file="${resolveFile(file.name, relative)}"`), 'env_bin_'));
    body = body.replace(/<geom[^>]*name="bin1_leg[^>]*\/>/g, '').replace(/pos="[^"]+"/, 'pos="0 0 0"');
    const factor = Math.min(.65, Math.max(.3, profile.reach * .5));
    body = body.replace(/\b(pos|size)="([^"]+)"/g, (_, key, text) => `${key}="${text.split(/\s+/).map((value) => +value * factor).join(' ')}"`);
    body = namespace(body, 'env_bin_').replace(/pos="[^"]+"/, `pos="${x + Math.min(.18, profile.reach * .18)} ${y - spread * .5} ${top + .02 * factor}"`).replace(/group="0"/g, 'group="3"');
    world.push(body);
  }
  xml = xml.replace('</mujoco>', `<asset>${assetXml.join('\n')}</asset><worldbody>${world.join('\n')}</worldbody></mujoco>`);
  return [...files.map((file) => file === scene ? { ...file, bytes: new TextEncoder().encode(xml) } : file), ...assets];
}
