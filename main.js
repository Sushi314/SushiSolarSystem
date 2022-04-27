import './assets/css/style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DepthFormat} from 'three';
import { ColorKeyframeTrack } from 'three';

//Builds canvas
const scene = new THREE.Scene();
const scene1 = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

//Camera
const camera = new THREE.PerspectiveCamera(80, aspectRatio, .001, 30000);
const cameraPositions = {
  x: -1000,
  y: -2500,
  z: 1000,
};

//Move camera and objects on scroll
function moveCamera() {
  const x = Object.values(cameraPositions)[0] + document.body.getBoundingClientRect().top;
  const y = Object.values(cameraPositions)[1] + document.body.getBoundingClientRect().top;
  const z = Object.values(cameraPositions)[2] + document.body.getBoundingClientRect().top;
  //Move camera postion
    camera.position.x = x * -1.00001;
    camera.position.y = y * -0.2;
    camera.position.z = z * 1.00001;
 };
document.body.onscroll = moveCamera;
moveCamera();

//Object textures
const space = new THREE.TextureLoader().load('./assets/images/Stars.jpg');
const sunTexture = new THREE.TextureLoader().load('./assets/images/sun.jpg');
const earthTexture = new THREE.TextureLoader().load('./assets/images/earth.jpg');
const moonTexture = new THREE.TextureLoader().load('./assets/images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./assets/images/normal.jpg');


//Background
scene.background = space;

//Build Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(150, 50, 50, 25),
  new THREE.MeshBasicMaterial({
    map: sunTexture, 
  })
);
sun.position.set(100, 0, 600);

//Build earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(60, 50, 50, 25),
  new THREE.MeshStandardMaterial({
    map:earthTexture, 
  })
);
const earthObj = new THREE.Object3D();
earthObj.position.set(0, 0, 0);
earthObj.add(earth);
earth.position.set(1000, 0, 0);

//Build moon
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
const pointLight = new THREE.PointLight(0xffffff, 10, 1500, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, .001);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(500, 50);
pointLight.position.set(0, 0, 0);

//Add Stars(Array(Number of stars))
function addStar() {
  const geometry = new THREE.SphereGeometry(2, 50, 50);
  const material = new THREE.MeshBasicMaterial({
    color: 0xfcf4bb,
  });
  const star = new THREE.Mesh(geometry, material);
  //FloatSpread (how large the star field will be)
  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(4500));
  star.position.set(x, y, z);
  scene.add(star);
};
Array(1000).fill().forEach(addStar);

//Add the objects to scene
scene.add(pointLight, earthObj, sun,  /*ambientLight, lightHelper*/);

const controls = new OrbitControls(camera, renderer.domElement);

//animates scene
function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += -0.01;

  moon.rotation.y += 0.00001; //Moon spin
  moonObj.rotation.y += 0.04; //Moon speed around Earth

  earth.rotation.y += 0.03; //Earth spin ALSO CONTROLS moonObj!!!
  earthObj.rotation.y += 0.008; //Earth speed around Sun

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
  renderer.render(scene, camera);
};

animate();