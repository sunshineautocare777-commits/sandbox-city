import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { createMap } from './map.js';
import { Player } from './player.js';
import { PhysicsTools } from './physgun.js';
import { NPCManager } from './npcs.js';
import { AISpawner } from './aiSpawner.js';
import { Multiplayer } from './multiplayer.js';

const canvas=document.querySelector('#game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x91b7ca); scene.fog=new THREE.Fog(0x91b7ca,90,360);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,700);
const world=new CANNON.World({gravity:new CANNON.Vec3(0,-9.82,0)}); world.broadphase=new CANNON.SAPBroadphase(world); world.allowSleep=true;
world.defaultContactMaterial.friction=.65;
scene.add(new THREE.HemisphereLight(0xcceaff,0x4a5360,1.5));
const sun=new THREE.DirectionalLight(0xffe4bd,2.1);sun.position.set(-70,120,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-180;sun.shadow.camera.right=180;sun.shadow.camera.top=180;sun.shadow.camera.bottom=-180;scene.add(sun);
const state={scene,world,camera,renderer,objects:[],wanted:0};
createMap(state);
const player=new Player(state); const tools=new PhysicsTools(state,player); const npcs=new NPCManager(state);
const ai=new AISpawner(state,npcs); const multiplayer=new Multiplayer(state,player,ai);
window.game={state,player,tools,npcs,ai,multiplayer,THREE,CANNON};
const clock=new THREE.Clock(); let toastTimer;
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
window.toast=toast;
document.querySelector('#ai-form').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#ai-input');const result=ai.interpret(input.value);document.querySelector('#ai-log').textContent=result;input.value='';});
document.querySelector('#ai-toggle').onclick=()=>document.querySelector('.ai-panel').classList.toggle('collapsed');
document.querySelector('#room-btn').onclick=()=>document.querySelector('#room-modal').classList.remove('hidden');
document.querySelector('#room-close').onclick=()=>document.querySelector('#room-modal').classList.add('hidden');
document.querySelector('#host-btn').onclick=async()=>{const code=document.querySelector('#room-code').value.trim()||'cidade-'+Math.random().toString(36).slice(2,7);document.querySelector('#room-code').value=code;document.querySelector('#room-feedback').textContent=await multiplayer.host(code)};
document.querySelector('#join-btn').onclick=async()=>{const code=document.querySelector('#room-code').value.trim();document.querySelector('#room-feedback').textContent=code?await multiplayer.join(code):'Digite o código da sala.'};
document.querySelector('#chat-form').addEventListener('submit',e=>{e.preventDefault();const i=document.querySelector('#chat-input');if(!i.value.trim())return;multiplayer.sendChat(i.value);addChat('Você: '+i.value);i.value='';});
function addChat(msg){const log=document.querySelector('#chat-log');const line=document.createElement('div');line.textContent=msg;log.append(line);log.scrollTop=log.scrollHeight}
window.addChat=addChat;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);player.update(dt);tools.update(dt);npcs.update(dt);multiplayer.update(dt);world.step(1/60,dt,3);
  for(const o of state.objects){if(o.body&&o.mesh){o.mesh.position.copy(o.body.position);o.mesh.quaternion.copy(o.body.quaternion)}}
  player.syncCamera();renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
toast('Sandbox carregada. Explore e construa!');
