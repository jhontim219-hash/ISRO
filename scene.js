import * as THREE from './node_modules/three/build/three.module.js';
window.THREE = THREE;

const legacyCanvas = document.getElementById('webgl');
if (legacyCanvas) legacyCanvas.remove();

const canvas = document.createElement('canvas');
canvas.id = 'webgl';
canvas.setAttribute('aria-hidden', 'true');
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02040a, 0.04);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 0, 18);

const ambient = new THREE.AmbientLight(0x6b7fff, 0.35);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(8, 8, 10);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xff9933, 12, 100, 2);
rimLight.position.set(-8, 5, 10);
scene.add(rimLight);

const starGeometry = new THREE.BufferGeometry();
const starCount = 4500;
const positionArray = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
  positionArray[i] = (Math.random() - 0.5) * 220;
  positionArray[i + 1] = (Math.random() - 0.5) * 220;
  positionArray[i + 2] = (Math.random() - 0.5) * 220;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0.9 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

const galaxyGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  const geo = new THREE.BufferGeometry();
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let j = 0; j < count * 3; j += 3) {
    const radius = 6 + Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;
    positions[j] = Math.cos(angle) * radius;
    positions[j + 1] = (Math.random() - 0.5) * 2;
    positions[j + 2] = Math.sin(angle) * radius;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: i % 2 === 0 ? 0xff9933 : 0x4da8ff,
    size: 0.18,
    transparent: true,
    opacity: 0.65,
  });
  const points = new THREE.Points(geo, mat);
  points.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, -18 - i * 3);
  points.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  galaxyGroup.add(points);
}
scene.add(galaxyGroup);

const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(12, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x7318ff, transparent: true, opacity: 0.14, side: THREE.BackSide })
);
nebula.position.set(0, 0, -15);
scene.add(nebula);

const earthGroup = new THREE.Group();
const earthMat = new THREE.MeshPhongMaterial({ color: 0x1f75ff, emissive: 0x090d2a, shininess: 30 });
const earth = new THREE.Mesh(new THREE.SphereGeometry(3.2, 48, 48), earthMat);
earthGroup.add(earth);
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(3.35, 48, 48), new THREE.MeshPhongMaterial({ color: 0x48cfff, transparent: true, opacity: 0.18, side: THREE.BackSide }));
earthGroup.add(atmosphere);
scene.add(earthGroup);
earthGroup.position.set(0, 0, -4);

const cloudGroup = new THREE.Group();
const cloudGeo = new THREE.SphereGeometry(3.24, 32, 32);
const cloudMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false });
for (let i = 0; i < 3; i++) {
  const cloud = new THREE.Mesh(cloudGeo, cloudMat);
  cloud.scale.set(1.05, 0.96, 1.08);
  cloud.position.set(Math.sin(i) * 0.3, Math.cos(i * 1.6) * 0.28, 0.05 * i);
  cloudGroup.add(cloud);
}
earthGroup.add(cloudGroup);

const moon = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), new THREE.MeshStandardMaterial({ color: 0xc8c2b4, roughness: 1, metalness: 0.05 }));
moon.position.set(8, 2, -8);
scene.add(moon);

const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.02, 12, 120), new THREE.MeshBasicMaterial({ color: 0x8fd2ff, transparent: true, opacity: 0.55 }));
orbitRing.rotation.x = Math.PI / 2.4;
scene.add(orbitRing);

const satellite = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.24), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x5bcfff }));
satellite.position.set(4.8, 0.8, -2.5);
scene.add(satellite);

const rocketGroup = new THREE.Group();
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdfe4ef, metalness: 0.78, roughness: 0.4 });
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 5.4, 28), bodyMat);
body.rotation.z = Math.PI / 2;
rocketGroup.add(body);

const nose = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.15, 20), bodyMat);
nose.position.set(2.82, 0, 0);
nose.rotation.z = -Math.PI / 2;
rocketGroup.add(nose);

const stage1 = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 1.9, 18), bodyMat);
stage1.position.set(-1.4, 0, 0);
stage1.rotation.z = Math.PI / 2;
rocketGroup.add(stage1);

const stage2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.6, 18), bodyMat);
stage2.position.set(-0.2, 0, 0);
stage2.rotation.z = Math.PI / 2;
rocketGroup.add(stage2);

const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.7, 16), new THREE.MeshBasicMaterial({ color: 0xff9933, transparent: true, opacity: 0.92 }));
flame.position.set(-3.1, 0, 0);
flame.rotation.z = Math.PI / 2;
rocketGroup.add(flame);

const boosterGlow = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0xff9933, transparent: true, opacity: 0.28 }));
boosterGlow.position.set(-3.45, 0, 0);
boosterGlow.rotation.y = Math.PI / 2;
rocketGroup.add(boosterGlow);

rocketGroup.position.set(0, -2.5, -8);
rocketGroup.rotation.set(0.16, 0.5, -0.12);
scene.add(rocketGroup);

const rocketCluster = new THREE.Group();
rocketCluster.name = 'rocketCluster';
const rocketDetails = [
  { x: -7.8, y: 1.4, z: -14, scale: 0.44, rotY: 0.8, color: 0xffebc9 },
  { x: -5.6, y: -1.6, z: -12.4, scale: 0.38, rotY: -0.6, color: 0xffc18a },
  { x: 6.7, y: 2.1, z: -15.4, scale: 0.48, rotY: -1.1, color: 0xffffff },
  { x: 8.2, y: -1.6, z: -13.2, scale: 0.34, rotY: 1.4, color: 0xe8f6ff },
  { x: 0.8, y: 3.5, z: -17.6, scale: 0.28, rotY: 0.2, color: 0xffdf98 },
];

rocketDetails.forEach((detail, index) => {
  const miniRocket = new THREE.Group();
  const miniBodyMat = new THREE.MeshStandardMaterial({ color: detail.color, metalness: 0.78, roughness: 0.4 });
  const miniBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 3.4, 20), miniBodyMat);
  miniBody.rotation.z = Math.PI / 2;
  miniRocket.add(miniBody);

  const miniNose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.8, 18), miniBodyMat);
  miniNose.position.set(1.72, 0, 0);
  miniNose.rotation.z = -Math.PI / 2;
  miniRocket.add(miniNose);

  const miniStage = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.1, 18), miniBodyMat);
  miniStage.position.set(-1.05, 0, 0);
  miniStage.rotation.z = Math.PI / 2;
  miniRocket.add(miniStage);

  const miniFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 1.05, 14),
    new THREE.MeshBasicMaterial({ color: 0xff9933, transparent: true, opacity: 0.9 })
  );
  miniFlame.position.set(-1.8, 0, 0);
  miniFlame.rotation.z = Math.PI / 2;
  miniRocket.add(miniFlame);

  miniRocket.position.set(detail.x, detail.y, detail.z);
  miniRocket.rotation.set(0.1, detail.rotY, -0.16 + index * 0.05);
  miniRocket.scale.setScalar(detail.scale);
  rocketCluster.add(miniRocket);
});
scene.add(rocketCluster);
window.rocketCluster = rocketCluster;

const frameData = { scroll: 0, earthRotation: 0, rocketY: -2.5, launch: false };
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  frameData.earthRotation += 0.0022;
  earthGroup.rotation.y = frameData.earthRotation;
  earthGroup.rotation.z = Math.sin(t * 0.55) * 0.03;
  atmosphere.rotation.y = -frameData.earthRotation * 0.6;
  cloudGroup.rotation.y = t * 0.35;

  moon.position.x = 8 + Math.sin(t * 0.4) * 0.4;
  moon.position.y = 2 + Math.cos(t * 0.7) * 0.2;
  moon.rotation.y += 0.002;

  satellite.position.x = 4.8 + Math.sin(t * 2.2) * 0.7;
  satellite.position.y = 0.8 + Math.cos(t * 1.8) * 0.5;
  satellite.position.z = -2.5 + Math.sin(t * 2.1) * 0.5;

  starField.rotation.y = t * 0.02;
  starField.rotation.x = Math.sin(t * 0.1) * 0.1;
  galaxyGroup.rotation.y = t * 0.05;
  nebula.rotation.y = t * 0.03;

  if (frameData.launch) {
    rocketGroup.position.y = frameData.rocketY;
    frameData.rocketY += 0.09;
    flame.scale.set(1 + Math.sin(t * 20) * 0.18, 1.9 + Math.sin(t * 20) * 0.4, 1);
    boosterGlow.scale.setScalar(1.25 + Math.sin(t * 20) * 0.15);
  } else {
    rocketGroup.position.y = -2.5 + Math.sin(t * 2) * 0.08;
    flame.scale.set(1, 1.2 + Math.sin(t * 8) * 0.3, 1);
    boosterGlow.scale.setScalar(1 + Math.sin(t * 10) * 0.06);
  }

  rocketCluster.rotation.y = t * 0.08;
  rocketCluster.position.z = -14 + Math.sin(t * 0.8) * 0.55;
  rocketCluster.position.x = Math.sin(t * 0.35) * 0.6;

  camera.position.x = Math.sin(frameData.scroll * 0.06) * 1.5;
  camera.position.y = Math.cos(frameData.scroll * 0.08) * 0.9;
  camera.position.z = 18 - frameData.scroll * 0.6;
  camera.lookAt(0, 0, -3);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('scroll', () => {
  frameData.scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if (frameData.scroll > 0.42) frameData.launch = true;
}, { passive: true });

window.sceneState = frameData;
