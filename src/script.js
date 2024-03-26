import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * ------------
 * PRESETS
 * ------------ */
// Canvas
const canvas = document.getElementById('canvas');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
let aspectRatio = sizes.width / sizes.height;

// Animation
const clock = new THREE.Clock();

/**
 * ------------
 * SCENE
 * ------------ */
const scene = new THREE.Scene();

const fog = new THREE.Fog('#262837', 1, 26);
scene.fog = fog;

/**
 * ------------
 * OBJECTS
 * ------------ */
const textureLoader = new THREE.TextureLoader();

// Floor
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House
const house = new THREE.Group();
scene.add(house);

// Walls
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
bricksColorTexture.colorSpace = THREE.SRGBColorSpace;
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);

walls.castShadow = true;
walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 3;
house.add(roof);

// Door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // requires a lot of subdivs for displacament
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
); // This is for supporting aoMap

door.position.y = 1;
door.position.z = 2.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.castShadow = true;
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.castShadow = true;
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.castShadow = true;
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.castShadow = true;
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6; // 3 is the size of the inner ring, 6 is the size of the outer ring
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;

  graves.add(grave);
}

/**
 * ------------
 * LIGHTS
 * ------------ */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26);
moonLight.castShadow = true;
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 3, 7);
doorLight.castShadow = true;
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 6, 3);
ghost1.castShadow = true;
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 6, 3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00', 6, 3);
ghost3.castShadow = true;
scene.add(ghost3);

/**
 * ------------
 * CAMERA
 * ------------ */
const camera = new THREE.PerspectiveCamera(35, aspectRatio);
camera.position.z = 12;
camera.position.x = 8;
camera.position.y = 5;
scene.add(camera);

/**
 * ------------
 * RENDER
 * ------------ */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;

/**
 * ------------
 * UTILS
 * ------------ */
// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  aspectRatio = sizes.width / sizes.height;

  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * ------------
 * ANIMATION
 * ------------ */
const ghostsAnimation = (et) => {
  const ghost1Angle = et * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(et * 3);

  const ghost2Angle = -et * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(et * 4) + Math.sin(et * 2.5);

  const ghost3Angle = -et * 0.18;
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(et * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(et * 0.5));
  ghost3.position.y = Math.sin(et * 4) + Math.sin(et * 2.5);
};

/**
 * ------------
 * START
 * ------------ */

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  ghostsAnimation(elapsedTime);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
