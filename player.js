import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

export class Player{
 constructor({scene,world,camera}){this.scene=scene;this.world=world;this.camera=camera;this.keys={};this.yaw=0;this.pitch=0;this.speed=9;this.onGround=false;this.velocity=new THREE.Vector3();this.tool=1;
  this.body=new CANNON.Body({mass:75,shape:new CANNON.Sphere(.65),position:new CANNON.Vec3(-105,3,0),fixedRotation:true,linearDamping:.15});this.body.updateMassProperties();world.addBody(this.body);
  this.camera.position.set(-105,4,5);this.bind();this.makeVehicle();
 }
 bind(){addEventListener('keydown',e=>{this.keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.code==='Digit1')this.setTool(1);if(e.code==='Digit2')this.setTool(2);if(e.code==='Digit3')this.setTool(3);if(e.code==='KeyF')this.setTool(1);if(e.code==='KeyE')this.setTool(2);if(e.code==='Space')this.jump();});addEventListener('keyup',e=>this.keys[e.code]=false);
  document.addEventListener('click',()=>{if(innerWidth>700&&document.pointerLockElement!==document.body)document.body.requestPointerLock?.()});
  document.addEventListener('mousemove',e=>{if(document.pointerLockElement===document.body){this.yaw-=e.movementX*.002;this.pitch=Math.max(-1.35,Math.min(1.35,this.pitch-e.movementY*.002))}});
  const setup=(id,kind)=>{const el=document.getElementById(id),knob=el.querySelector('.stick-knob');let active=false,pid=null;const move=e=>{if(!active||e.pointerId!==pid)return;const r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),scale=Math.min(1,43/(len||1)),x=dx*scale,y=dy*scale;knob.style.transform=`translate(${x}px,${y}px)`;this[kind]={x:x/43,y:y/43}};el.addEventListener('pointerdown',e=>{active=true;pid=e.pointerId;el.setPointerCapture(pid);move(e)});el.addEventListener('pointermove',move);const end=()=>{active=false;this[kind]={x:0,y:0};knob.style.transform=''};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)};
  this.moveStick={x:0,y:0};this.lookStick={x:0,y:0};setup('move-stick','moveStick');setup('look-stick','lookStick');
  document.querySelector('#jump-btn').onclick=()=>this.jump();document.querySelector('#fire-btn').onclick=()=>window.game.tools.use();
 }
 setTool(n){this.tool=n;document.querySelector('#weapon-name').textContent=['','Physics Gun','Tool Gun','Blaster'][n];}
 jump(){if(Math.abs(this.body.velocity.y)<.35)this.body.velocity.y=7.5}
 update(dt){const forward=Number(this.keys.KeyW||this.keys.ArrowUp)-Number(this.keys.KeyS||this.keys.ArrowDown)-this.moveStick.y;const side=Number(this.keys.KeyD||this.keys.ArrowRight)-Number(this.keys.KeyA||this.keys.ArrowLeft)+this.moveStick.x;
  this.yaw-=this.lookStick.x*.055;this.pitch=Math.max(-1.35,Math.min(1.35,this.pitch-this.lookStick.y*.045));
  const dir=new THREE.Vector3(side,0,-forward).applyAxisAngle(new THREE.Vector3(0,1,0),this.yaw);if(dir.lengthSq()>1)dir.normalize();this.body.velocity.x=dir.x*this.speed;this.body.velocity.z=dir.z*this.speed;
  if(this.keys.Space)this.jump();
 }
 syncCamera(){const p=this.body.position;this.camera.position.set(p.x,p.y+.55,p.z);this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch}
 get direction(){return new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(this.pitch,this.yaw,0,'YXZ')).normalize()}
 makeVehicle(){this.vehicle=null}
}
