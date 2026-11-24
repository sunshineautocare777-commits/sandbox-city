import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
export class PhysicsTools{
 constructor(state,player){this.state=state;this.player=player;this.held=null;this.ray=new THREE.Raycaster();this.anchor=new THREE.Vector3();this.frozen=new Set();this.lastShot=0}
 cast(){this.ray.set(this.player.camera.position,this.player.direction);this.ray.far=35;return this.ray.intersectObjects(this.state.scene.children,true)[0]}
 use(){const tool=this.player.tool;if(tool===1)this.grab();else if(tool===2)this.spawnThruster();else this.shoot()}
 grab(){if(this.held){this.held.body.type=CANNON.Body.DYNAMIC;this.held.body.mass=5;this.held.body.updateMassProperties();this.held=null;return}
  const hit=this.cast();if(!hit)return;const item=this.state.objects.find(o=>o.mesh===hit.object||o.mesh.children.includes(hit.object));if(item){this.held=item;window.toast('Objeto agarrado · clique novamente para soltar')}}
 update(){if(!this.held)return;const target=this.player.camera.position.clone().add(this.player.direction.clone().multiplyScalar(7));this.held.body.position.set(target.x,target.y,target.z);this.held.body.velocity.set(0,0,0)}
 spawnThruster(){const p=this.player.body.position;const mesh=new THREE.Mesh(new THREE.ConeGeometry(.45,1.4,8),new THREE.MeshStandardMaterial({color:0x42dfff,emissive:0x07536a}));mesh.position.set(p.x+2,p.y+1,p.z);this.state.scene.add(mesh);window.toast('Thruster criado (protótipo)')}
 shoot(){const hit=this.cast();if(!hit)return;const obj=this.state.objects.find(o=>o.mesh===hit.object);if(obj){const d=this.player.direction;obj.body.applyImpulse(new CANNON.Vec3(d.x*22,d.y*22,d.z*22),obj.body.position)}}
}
