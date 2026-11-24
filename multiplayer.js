import Peer from 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/+esm';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
export class Multiplayer{
 constructor(state,player,ai){this.state=state;this.player=player;this.ai=ai;this.peer=null;this.connections=[];this.remote=new Map();this.timer=0}
 host(code){return this.start(code,true)}
 join(code){return this.start(code,false)}
 start(code,isHost){return new Promise(resolve=>{this.peer=new Peer(code,{debug:0});this.peer.on('open',id=>{document.querySelector('#online-status').textContent='Sala: '+id;resolve(isHost?'Sala criada! Compartilhe o código: '+id:'Conectado como '+id)});this.peer.on('connection',c=>this.attach(c));if(!isHost){const target=new Peer(undefined,{debug:0});target.on('open',()=>{const c=target.connect(code);this.attach(c);this.peer=target});target.on('error',e=>resolve('Não foi possível conectar: '+e.message))}this.peer.on('error',e=>resolve('Erro PeerJS: '+e.message))})}
 attach(c){this.connections.push(c);c.on('open',()=>window.toast('Jogador conectado'));c.on('data',data=>this.receive(data));c.on('close',()=>window.addChat('Jogador desconectado.'))}
 send(data){for(const c of this.connections)if(c.open)c.send(data)}
 sendChat(message){this.send({type:'chat',message})}
 receive(data){if(data.type==='chat')window.addChat('Outro jogador: '+data.message);if(data.type==='state')this.drawRemote(data.id,data.position)}
 drawRemote(id,pos){let mesh=this.remote.get(id);if(!mesh){mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.45,1,4,8),new THREE.MeshStandardMaterial({color:0x55dfff}));this.state.scene.add(mesh);this.remote.set(id,mesh)}mesh.position.set(pos.x,pos.y-0.5,pos.z)}
 update(dt){this.timer+=dt;if(this.timer>.08){this.timer=0;this.send({type:'state',id:this.peer?.id||'player',position:{x:this.player.body.position.x,y:this.player.body.position.y,z:this.player.body.position.z}})}}
}
