import path from 'node:path';
import { writeFile } from "node:fs/promises";
const revision = '370c43965323c0944b433b202aac5058b5f907a9';
const requested = [
  ['franka_emika_panda','Franka Panda'], ['franka_fr3','Franka Research 3'],
  ['franka_fr3_v2','Franka FR3 v2'], ['franka_fr3_duo','Franka FR3 Duo'],
  ['universal_robots_ur5e','Universal Robots UR5e'], ['universal_robots_ur10e','Universal Robots UR10e'],
  ['ufactory_xarm7','UFACTORY xArm 7'], ['ufactory_lite6','UFACTORY Lite 6'],
  ['kinova_gen3','Kinova Gen3'], ['kuka_iiwa_14','KUKA iiwa 14'],
  ['rethink_robotics_sawyer','Rethink Sawyer'], ['agilex_piper','AgileX PiPER'],
  ['arx_l5','ARX L5'], ['fanuc_crx5ia','FANUC CRX-5iA'],
  ['flexiv_rizon4','Flexiv Rizon 4'], ['flexiv_rizon4s','Flexiv Rizon 4s'],
  ['unitree_z1','Unitree Z1'], ['trossen_vx300s','Trossen VX300s'],
  ['trossen_wx250s','Trossen WX250s'], ['trossen_wxai','Trossen WXAI'],
  ['robotstudio_so101','SO-101'], ['trs_so_arm100','SO-ARM100'],
  ['low_cost_robot_arm','Low Cost Robot Arm'], ['i2rt_yam','I2RT YAM'],
  ['robotis_omy_3m','ROBOTIS OMY'], ['seeed_rebot_devarm','Seeed ReBot DevArm'],
];
const response=await fetch(`https://api.github.com/repos/google-deepmind/mujoco_menagerie/git/trees/${revision}?recursive=1`);
if(!response.ok)throw new Error('Could not inspect official model tree');
const tree=(await response.json()).tree;
const catalog=[];
const rawBase = 'https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/' + revision + '/';
const links = new Map();
async function resolve(real, local, sources, depth = 0) {
  if (depth > 6) throw new Error('Recursive asset link');
  const item = tree.find(item => item.path === real);
  if (item?.mode === '120000') {
    let target=links.get(real);
    if(!target) { const response=await fetch(rawBase+real); if(!response.ok)throw new Error('Bad symlink'); target=(await response.text()).trim();links.set(real,target); }
    return resolve(path.posix.normalize(path.posix.join(path.posix.dirname(real),target)),local,sources,depth+1);
  }
  if(item?.type==='blob'){sources[local]=rawBase+real;return;}
  for(const file of tree.filter(item=>item.type==='blob'&&item.path.startsWith(real+'/'))){
    await resolve(file.path,local+'/'+file.path.slice(real.length+1),sources,depth+1);
  }
}
for(const [id,label] of requested){
  const prefix=id+'/';
  const paths=tree.filter(item=>item.type==='blob'&&item.path.startsWith(prefix)).map(item=>item.path.slice(prefix.length));
  const entry=paths.includes('scene.xml')?'scene.xml':paths.find(p=>/^scene[^/]*\.xml$/.test(p));
  if(!entry){ console.log('No standalone scene; omitted:',id);continue; }
  const sources={};
  for(const file of tree.filter(item=>item.type==='blob'&&item.path.startsWith(prefix))){
    const local=file.path.slice(prefix.length);
    if(local.endsWith('.xml')||local==='assets'||local.startsWith('assets/')) await resolve(file.path,local,sources);
  }
  catalog.push({id,label,entry,revision,sources,source:`https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/${revision}/${id}/`,
    files:Object.keys(sources),
    license:`https://github.com/google-deepmind/mujoco_menagerie/blob/${revision}/${id}/LICENSE`,
  });
}
await writeFile('public/simulation/robot-catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log('Prepared',catalog.length,'official robot entries. Assets download only when selected.');
