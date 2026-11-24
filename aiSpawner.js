import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
export class AISpawner{
 constructor(state,npcs){this.state=state;this.npcs=npcs}
 interpret(raw){const text=raw.toLowerCase().trim();if(!text)return'Escreva o que deseja criar.';const p=this.state.camera.position;const front=this.state.camera.getWorldDirection(new THREE.Vector3());const base=p.clone().add(front.multiplyScalar(9));
  const countMatch=text.match(/\b(\d+)\b/);const count=Math.min(12,Math.max(1,countMatch?Number(countMatch[1]):1));
  if(/pol[ií]cia|policial/.test(text)){for(let i=0;i<count;i++)this.npcs.spawn('police',base.clone().add(new THREE.Vector3(i*2,0,0)));return`${count} unidade(s) policial(is) chegaram. Nível de procurado aumentado.`}
  if(/inimig|zumbi|monstro|rob[oô] hostil/.test(text)){for(let i=0;i<count;i++)this.npcs.spawn('enemy',base.clone().add(new THREE.Vector3(i*2,0,0)));return`${count} entidade(s) hostil(is) criada(s). Cuidado!`}
  if(/civil|pessoa|npc|boneco/.test(text)){for(let i=0;i<count;i++)this.npcs.spawn('civil',base.clone().add(new THREE.Vector3(i*2,0,0)));return`${count} personagem(ns) criado(s).`}
  let color=0x4b9cff;if(/vermelh/.test(text))color=0xe34444;else if(/verde/.test(text))color=0x42bd75;else if(/amarel/.test(text))color=0xf0c34e;else if(/azul/.test(text))color=0x3985e8;
  const kind=/carro|ve[ií]culo/.test(text)?'carro':/esfera|bola/.test(text)?'esfera':'cubo';
  for(let i=0;i<count;i++)this.spawnProp(kind,base.clone().add(new THREE.Vector3(i*1.8,1,0)),color);
  return`${count} ${kind}(s) criado(s) com sucesso.`
 }
 spawnProp(kind,pos,color){const {scene,world,objects}=this.state;const geometry=kind==='esfera'?new THREE.SphereGeometry(.8,18,14):kind==='carro'?new THREE.BoxGeometry(2.5,.8,1.35):new THREE.BoxGeometry(1.5,1.5,1.5);const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.12}));mesh.position.copy(pos);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);const half=kind==='esfera'?new CANNON.Sphere(.8):new CANNON.Box(new CANNON.Vec3(kind==='carro'?1.25:.75,kind==='carro'?.4:.75,kind==='carro'?.675:.75));const body=new CANNON.Body({mass:kind==='carro'?35:8,shape:half,position:new CANNON.Vec3(pos.x,pos.y,pos.z),linearDamping:.08});world.addBody(body);objects.push({mesh,body});}
}
