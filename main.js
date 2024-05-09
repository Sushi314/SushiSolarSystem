import './assets/css/style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DepthFormat} from 'three';

//Builds canvas
const scene = new THREE.Scene();
const scene1 = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(90, aspectRatio, .001, 3000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.set(150, 200, 1000);

//Background
const space = new THREE.TextureLoader().load('./assets/images/Stars.jpg');
scene.background = space;

//Global Object proerties
const normalTexture = new THREE.TextureLoader().load('./assets/images/normal.jpg');
const controls = new OrbitControls(camera, renderer.domElement);

//Build Sun
const sunTexture = new THREE.TextureLoader().load('./assets/images/sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(150, 50, 50, 25),
  new THREE.MeshBasicMaterial({
    map: sunTexture,
    
  })
);
sun.position.set(0, 0, 0);

//Build earth
const earthTexture = new THREE.TextureLoader().load('./assets/images/earth.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(60, 50, 50, 25),
  new THREE.MeshStandardMaterial({
    map:earthTexture, 
  })
);
const earthObj = new THREE.Object3D();
earthObj.add(earth);
earth.position.set(1000, 0, 0);

//Build moon
const moonTexture = new THREE.TextureLoader().load('./assets/images/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(15, 28, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
const moonObj = new THREE.Object3D();
earth.add(moonObj);
moonObj.add(moon);
moon.position.set(100, 0, 0);


//Lighting
const pointLight = new THREE.PointLight(0xffffff, 2, 5000);
const ambientLight = new THREE.AmbientLight(0xffffff, .001);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(500, 50);
pointLight.position.set(0, 0, 0);


//Add Stars(Array(Number of stars))
function addStar() {
  const geometry = new THREE.SphereGeometry(1, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    color: 0xfcf4bb,
    normalMap: normalTexture
  });
  const star = new THREE.Mesh(geometry, material);
  //FloatSpread (how large the star field will be)
  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(2000));
  star.position.set(x, y, z);
  scene.add(star);
};
Array(1000).fill().forEach(addStar);

//Add the objects to scene

scene.add(ambientLight, pointLight, earthObj, sun, /*lightHelper,  gridHelper*/);


//animates scene
function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += -0.01;

  moon.rotation.y += 0.5; //Moon spin
  moonObj.rotation.y += 0.08; //Moon speed around Earth

  earth.rotation.y += 0.01; //Earth spin
  earthObj.rotation.y += 0.008; //Earth speed around Sun
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
  renderer.render(scene, camera);
};

animate();

//Test