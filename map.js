import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

export function createMap({scene,world,objects}){
  const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness});
  const groundMat=mat(0x657c68),roadMat=mat(0x303941),concrete=mat(0x92999c),glass= new THREE.MeshStandardMaterial({color:0x4c8296,metalness:.25,roughness:.2});
  function box(x,y,z,sx,sy,sz,material,solid=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);if(solid){const body=new CANNON.Body({mass:0,shape:new CANNON.Box(new CANNON.Vec3(sx/2,sy/2,sz/2)),position:new CANNON.Vec3(x,y,z)});world.addBody(body)}return mesh}
  box(0,-.6,0,520,1,520,groundMat);
  // Grande área plana estilo gm_construct
  box(-105,.02,0,135,.15,135,mat(0x9ca5a5));
  // Malha visual da área de construção
  const grid=new THREE.GridHelper(130,65,0x56636a,0x7b878a);grid.position.set(-105,.12,0);scene.add(grid);
  // Ruas e quadras da cidade
  for(let i=-2;i<=2;i++){box(i*48,.015,95,13,.12,250,roadMat,false);box(95,.02,i*48,250,.12,13,roadMat,false)}
  // Calçadas e prédios variados
  for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++){
    const cx=95+x*48,cz=95+z*48;if(Math.abs(cx)<28&&Math.abs(cz)<28)continue;
    box(cx,.08,cz,34,.25,34,concrete,false);
    const h=12+((x*17+z*29+100)%5)*7;
    const building=box(cx,.2+h/2,cz,18,h,18,mat([0x687783,0x8b7969,0x596d75,0x9b9a8d][Math.abs(x+z)%4]),true);
    // faixas de janelas decorativas
    for(let floor=2;floor<h;floor+=3){const win=new THREE.Mesh(new THREE.BoxGeometry(18.1,.9,18.1),glass);win.position.set(cx,.2+floor,cz);scene.add(win)}
  }
  // Árvores, postes e pontos de interesse
  for(let i=0;i<34;i++){const x=-45+(i*37)%260,z=-100+(i*53)%260;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,4,7),mat(0x59432e));trunk.position.set(x,2,z);scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.7,1),mat(0x376b4d));crown.position.set(x,5,z);crown.castShadow=true;scene.add(crown)}
  // Spawn inicial e marcos
  const sign= new THREE.Mesh(new THREE.BoxGeometry(9,3,.3),new THREE.MeshStandardMaterial({color:0x123447,emissive:0x08202c}));sign.position.set(-105,4,-55);scene.add(sign);
  return {box};
}
