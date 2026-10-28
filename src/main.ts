import * as T from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import GUI from 'lil-gui';
import './style.css';
import { floodNormals, plaster } from './surfaces';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
const scene=new T.Scene();scene.background=new T.Color('#c2b6a7');scene.fog=new T.FogExp2('#c2b6a7',.0055);
const camera=new T.PerspectiveCamera(44,innerWidth/innerHeight,.1,1400);
const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;document.querySelector('#scene')!.appendChild(renderer.domElement);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
scene.add(new T.HemisphereLight('#dbe4ef','#68685e',1.35));const sun=new T.DirectionalLight('#ffebd7',2.5);sun.position.set(45,32,25);scene.add(sun);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:40,bottom:-25,near:1,far:150});sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;

const sky=new T.Mesh(new T.SphereGeometry(650,48,24),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color('#7f858c')},bottom:{value:scene.fog.color},glow:{value:new T.Color('#dfbda7')}},vertexShader:'varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec3 v;uniform vec3 top;uniform vec3 bottom;uniform vec3 glow;void main(){vec3 dir=normalize(v);float h=max(dir.y,0.);vec3 color=mix(bottom,top,smoothstep(0.,.65,h));float halo=exp(-pow((h-.13)*5.,2.))*smoothstep(0.,.065,h);color=mix(color,glow,halo*.6);gl_FragColor=vec4(color,1.);
#include <colorspace_fragment>
}`}));scene.add(sky);
const normals=floodNormals();
let water!:Water;function makeWater(low=false){if(water){scene.remove(water);water.geometry.dispose();water.material.dispose();}water=new Water(new T.PlaneGeometry(2200,2200),{textureWidth:low?256:1024,textureHeight:low?256:1024,waterNormals:normals,sunDirection:sun.position.clone().normalize(),sunColor:0xe5d8c4,waterColor:0x414842,distortionScale:.12,fog:true});water.rotation.x=-Math.PI/2;scene.add(water);}makeWater();
const wallMap=plaster();const stone=new T.MeshStandardMaterial({color:'#e3e5e3',map:wallMap,bumpMap:wallMap,bumpScale:.055,roughness:.94});const trim=new T.MeshStandardMaterial({color:'#c7c9c4',map:wallMap,bumpMap:wallMap,bumpScale:.025,roughness:.88});const dark=new T.MeshStandardMaterial({color:'#242c2d',roughness:.78});const roof=new T.MeshStandardMaterial({color:'#555a57',roughness:1});
function box(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material=stone,parent:T.Object3D=scene){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cylinder(rt:number,rb:number,h:number,x:number,y:number,z:number,m:T.Material,parent:T.Object3D=scene){const a=new T.Mesh(new T.CylinderGeometry(rt,rb,h,16),m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
const island=cylinder(16,18,1.1,0,-.12,0,roof);island.scale.z=.65;
const ip=island.geometry.getAttribute('position');for(let i=0;i<ip.count;i++){const x=ip.getX(i),z=ip.getZ(i);const k=1+.07*Math.sin(x*1.9+z*.8);ip.setXYZ(i,x*k,ip.getY(i),z*k);}island.geometry.computeVertexNormals();
const building=new T.Group();scene.add(building);box(15,16,9,0,8.7,0,stone,building);
for(const y of [1.2,6.2,11.3,16.5]){box(15.6,.3,9.5,0,y,0,trim,building);box(15.3,.13,9.2,0,y+.25,0,roof,building);}
for(const x of [-7.15,7.15])for(let y=1.8;y<16;y+=.65)box(.6,.53,9.12,x,y,0,trim,building);
function windowAt(x:number,y:number){box(1.6,2.6,.14,x,y,4.57,dark,building);for(const dx of [-.95,.95])box(.17,3,.3,x+dx,y,4.7,trim,building);for(const dy of [-1.48,1.48])box(2.2,.18,.42,x,y+dy,4.75,trim,building);box(.08,2.6,.2,x,y,4.75,trim,building);for(const dy of [-.55,.55])box(1.6,.08,.2,x,y+dy,4.75,trim,building);}
for(const y of [3.5,8.8,13.8])for(const x of [-4.7,0,4.7]){if(y===13.8&&x===0)continue;windowAt(x,y);}
// Inset circular attic windows and carved surrounds echo the reference civic facade.
for(const x of [-1.85,0,1.85]){const ring=new T.Mesh(new T.TorusGeometry(.53,.14,8,24),trim);ring.position.set(x,14.1,4.75);building.add(ring);const pane=new T.Mesh(new T.CircleGeometry(.46,24),dark);pane.position.set(x,14.1,4.59);building.add(pane);}
for(const y of [6.1,11.2,16.4])for(const [width,height,depth,offset] of [[15.7,.12,9.5,0],[15.45,.15,9.3,-.16],[15.2,.1,9.15,-.29]])box(width,height,depth,0,y+offset,0,trim,building);
for(let x=-7;x<=7;x+=.6)box(.22,.22,.25,x,16.16,4.75,trim,building);
// Side facade repeats framed recesses instead of a featureless solid wall.
for(const y of [3.5,8.8,13.8])for(const z of [-2.5,1.1]){box(.08,2.6,1.45,7.53,y,z,dark,building);for(const dz of [-.85,.85])box(.3,3,.15,7.65,y,z+dz,trim,building);for(const dy of [-1.45,1.45])box(.35,.16,1.9,7.65,y+dy,z,trim,building);box(.2,2.6,.08,7.67,y,z,trim,building);}
const arch=new T.Mesh(new T.TorusGeometry(1.1,.16,8,32,Math.PI),trim);arch.position.set(0,10.15,4.76);building.add(arch);

box(2.1,3.5,.24,0,2.8,4.85,dark,building);for(let i=0;i<7;i++)box(3.5,.22,1,0,.15+i*.16,8-i*.43,trim);
const pediment=new T.Mesh(new T.ConeGeometry(10.7,2,4),roof);pediment.rotation.y=Math.PI/4;pediment.scale.z=.6;pediment.position.y=17.6;building.add(pediment);
cylinder(1.5,1.7,1,0,19,0,trim,building);cylinder(1.1,1.1,2,0,20.3,0,dark,building);for(let i=0;i<8;i++){const a=i*Math.PI/4;cylinder(.1,.1,2,Math.cos(a)*1.15,20.3,Math.sin(a)*1.15,trim,building);}const dome=new T.Mesh(new T.SphereGeometry(1.6,24,12,0,Math.PI*2,0,Math.PI/2),roof);dome.position.set(0,21.3,0);building.add(dome);cylinder(0,.16,1,0,23.2,0,trim,building);
box(4,4.5,6,9,2.6,-1);box(4.5,.3,6.5,9,5,-1,roof);
let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
function branch(a:T.Vector3,b:T.Vector3,r:number){const delta=b.clone().sub(a);const mesh=new T.Mesh(new T.CylinderGeometry(r*.35,r,delta.length(),5),roof);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());scene.add(mesh);}
function tree(x:number,z:number,h:number){branch(new T.Vector3(x,0,z),new T.Vector3(x+.4,h,z),.14);for(let i=0;i<7;i++){const y=h*(.3+rand()*.6),s=i%2?1:-1;const a=new T.Vector3(x+.2,y,z),b=new T.Vector3(x+s*(1+rand()),y+1,z+rand()-.5);branch(a,b,.07);branch(b,b.clone().add(new T.Vector3(s*.5,1,rand()-.5)),.035);}}
for(const [x,z,h]of [[-12,3,5],[13,1,4],[-28,20,6],[30,30,6],[45,-12,4]])tree(x,z,h);
for(let i=0;i<55;i++){const x=(rand()-.5)*340,z=-45-rand()*260;box(4+rand()*5,2+rand()*4,5,x,.1,z,stone);const r=new T.Mesh(new T.ConeGeometry(5,2.8,4),roof);r.rotation.y=Math.PI/4;r.position.set(x,3,z);scene.add(r);}
const poles:T.Vector3[]=[];for(let i=0;i<5;i++){const x=-28-i*12,z=22-i*22;const p=new T.Group();p.position.set(x,0,z);p.rotation.z=-.18;scene.add(p);cylinder(.12,.18,8,0,2,0,roof,p);box(4,.15,.18,0,5.5,0,roof,p);poles.push(new T.Vector3(x+1,5.5,z));}for(let i=1;i<poles.length;i++)for(const dx of [-1.5,1.5]){const a=poles[i-1].clone().add(new T.Vector3(dx,0,0)),b=poles[i].clone().add(new T.Vector3(dx,0,0)),mid=a.clone().lerp(b,.5);mid.y-=2;const curve=new T.QuadraticBezierCurve3(a,mid,b);scene.add(new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(30)),new T.LineBasicMaterial({color:0x484841})));}
let exploring=false;
const controls=new PointerLockControls(camera,renderer.domElement);const keys=new Set<string>();function reference(){exploring=false;camera.position.set(23,13.5,108);camera.lookAt(-7,7,0);}reference();
const enter=document.querySelector<HTMLButtonElement>('#enter')!;enter.onclick=()=>controls.lock();controls.addEventListener('lock',()=>{exploring=true;camera.position.y=1.75;document.body.classList.add('playing');});controls.addEventListener('unlock',()=>{exploring=false;document.body.classList.remove('playing');keys.clear();});document.addEventListener('pointerlockerror',()=>{enter.textContent='点击重试进入梦境';});
addEventListener('keydown',e=>{keys.add(e.code);if(e.code==='KeyH')document.body.classList.toggle('capture');if(e.code==='KeyP'){controls.unlock();reference();} });addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>keys.clear());
if(new URLSearchParams(location.search).has('capture'))document.body.classList.add('capture');
let low=false;document.querySelector('#quality')!.addEventListener('click',()=>{low=!low;renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=!low;document.querySelector('#quality')!.textContent=`画质：${low?'低':'高'}`;});
if(new URLSearchParams(location.search).has('debug')){const gui=new GUI();gui.add(renderer,'toneMappingExposure',.5,1.6).name('曝光');gui.add(scene.fog,'density',.001,.025).name('雾浓度');gui.add(water.material.uniforms.distortionScale,'value',0,3).name('波纹幅度');gui.add(sun,'intensity',0,4).name('阳光');}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
// Static opaque geometry is merged by material: retain the reflection pass without hundreds of small draws.
scene.updateMatrixWorld(true);const batches=new Map<T.Material,T.BufferGeometry[]>();const originals:T.Mesh[]=[];
scene.traverse(o=>{if(o instanceof T.Mesh&&o!==water&&o!==sky&&!Array.isArray(o.material)){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);const list=batches.get(o.material)||[];list.push(g);batches.set(o.material,list);originals.push(o);}});
for(const o of originals){o.removeFromParent();o.geometry.dispose();}for(const [material,geometries]of batches){const geometry=mergeGeometries(geometries);if(geometry){const mesh=new T.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);}for(const g of geometries)g.dispose();}
const clock=new T.Clock();let frames=0,total=0;renderer.setAnimationLoop(()=>{const elapsed=clock.getDelta(),dt=Math.min(elapsed,.05);water.material.uniforms.time.value+=dt*.18;if(controls.isLocked&&exploring){const old=camera.position.clone();let x=Number(keys.has('KeyD'))-Number(keys.has('KeyA')),z=Number(keys.has('KeyW'))-Number(keys.has('KeyS'));const len=Math.hypot(x,z)||1,s=(keys.has('ShiftLeft')?8:4)*dt;controls.moveRight(x/len*s);controls.moveForward(z/len*s);if((Math.abs(camera.position.x)<8.1&&Math.abs(camera.position.z)<5.2)||(camera.position.x>6&&camera.position.x<12&&camera.position.z>-5&&camera.position.z<3)||Math.hypot(camera.position.x,camera.position.z)>140)camera.position.copy(old);camera.position.y=T.MathUtils.lerp(camera.position.y,1.75,Math.min(1,dt*3));}renderer.render(scene,camera);frames++;total+=elapsed;if(total>2){(window as any).__dream={fps:Math.round(frames/total),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,position:camera.position.toArray()};frames=0;total=0;}});
