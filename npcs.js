import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
export class NPCManager{
 constructor(state){this.state=state;this.items=[]}
 spawn(type='civil',position){const p=position||this.state.camera.position.clone().add(new THREE.Vector3(0,0,-9).applyQuaternion(this.state.camera.quaternion));const color=type==='police'?0x2455a8:type==='enemy'?0xa52b35:0xd1a36a;const group=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.9,4,8),new THREE.MeshStandardMaterial({color}));body.position.y=1;group.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.28,12,10),new THREE.MeshStandardMaterial({color:0xe0b994}));head.position.y=1.75;group.add(head);group.position.set(p.x,0,p.z);this.state.scene.add(group);this.items.push({group,type,phase:Math.random()*6});if(type==='police')this.wanted(1);return group}
 wanted(n){this.state.wanted=Math.min(5,this.state.wanted+n);document.querySelector('#wanted-stars').textContent='★'.repeat(this.state.wanted)+'☆'.repeat(5-this.state.wanted)}
 update(dt){for(const npc of this.items){npc.phase+=dt; if(npc.type==='enemy'){const p=this.state.camera.position;const d=new THREE.Vector3(p.x-npc.group.position.x,0,p.z-npc.group.position.z);if(d.length()>2&&d.length()<35){d.normalize();npc.group.position.addScaledVector(d,dt*1.2);npc.group.rotation.y=Math.atan2(d.x,d.z)}}else if(npc.type==='civil'){npc.group.position.x+=Math.sin(npc.phase*.4)*dt*.25}}}
}
