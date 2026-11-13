import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import loadMujoco from '@mujoco/mujoco';
import { ArmSimulation } from '../public/simulation/physics.mjs';
import { composeScene } from '../public/simulation/scene.mjs';

const catalog=JSON.parse(await readFile('public/simulation/robot-catalog.json','utf8'));
await mkdir('.simulation-cache',{recursive:true});
const mujoco=await loadMujoco();
const profiles=JSON.parse(await readFile('public/simulation/workspace-profiles.json','utf8'));
const assetManifest=JSON.parse(await readFile('public/environments/manifest.json','utf8'));
const assets=await Promise.all(assetManifest.files.filter(file=>/\.(xml|obj|msh|png)$/.test(file.name)).map(async file=>({name:'environment/'+file.name,bytes:new Uint8Array(await readFile('public/environments/'+file.name))})));
let failed=0;
for(const robot of catalog){
  let sim;
  try {
    const files=new Array(robot.files.length);
    let next=0;
    await Promise.all(Array.from({length:5},async()=>{
      while(next<robot.files.length){
        const index=next++;
        const name=robot.files[index];
        const url=robot.sources[name];
        const cache='.simulation-cache/'+createHash('sha256').update(url).digest('hex');
        let bytes;
        try {bytes=await readFile(cache);} catch {
          const response=await fetch(url);
          if(!response.ok)throw new Error('Asset unavailable: '+name);
          bytes=new Uint8Array(await response.arrayBuffer());
          await writeFile(cache,bytes);
        }
        files[index]={name,bytes:new Uint8Array(bytes)};
      }
    }));
    for(const environment of ['ground','workbench','sorting']) {
      const profile=profiles[robot.id];
      const composed=composeScene(files,robot.entry,environment,[],{assets,profile,robotId:robot.id});
      sim=new ArmSimulation(mujoco,composed,robot.entry,{profile,onTable:environment!=='ground'});
      if(!sim.controls.length)throw new Error('No actuators found');
      let deepest=sim.contactDepth();
      for(let sample=0;sample<50;sample++){sim.step(10);deepest=Math.min(deepest,sim.contactDepth());}
      if(!sim.snapshot().transforms.every(Number.isFinite))throw new Error('Nonfinite transforms');
      if(deepest < -.002)throw new Error(`${environment}: native penetration ${deepest.toFixed(5)} m`);
      const geoms=sim.geometry();
      if(geoms.some(geom=>![0,2,3,4,5,6,7].includes(geom.type)))throw new Error('Unsupported visible geometry');
      if(geoms.some(geom=>geom.uvs&&!geom.uvs.every(Number.isFinite)))throw new Error('Invalid texture coordinates');
      console.log('PASS',robot.id,environment,'actuators',sim.controls.length,'depth',deepest.toFixed(6));
      sim.dispose();sim=undefined;
    }
  } catch(error){failed++;console.log('FAIL',robot.id,error.message);}
  finally {sim?.dispose();}
}
console.log('Validated',catalog.length-failed,'/',catalog.length,'official models.');
if(failed)process.exitCode=1;
