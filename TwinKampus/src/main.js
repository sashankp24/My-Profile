import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

let canvas = document.querySelector('.three-js');
if (!canvas) {
  canvas = document.createElement('canvas');
  canvas.className = 'three-js';
  document.body.appendChild(canvas);
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
camera.position.set(0, 1, 5);
let renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);


const mtlLoader = new MTLLoader();
mtlLoader.load('/IITK_3MODEL v1.mtl', (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load(
    '/IITK_3MODEL v1.obj', 
    (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      object.position.set(-center.x, -center.y, -center.z); // Center the object at origin
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      object.scale.setScalar(scale);
      scene.add(object);
      camera.position.set(0, size.y * scale, size.z * scale * 1.5);
      controls.target.set(0, 0, 0); // Make controls orbit around the object
      controls.update();
    },
  ) 
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
