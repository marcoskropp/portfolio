import { EffectComposer } from './libs/postprocessing/EffectComposer.js';
import { changeRBG, onWindowResize } from './utils.js';
import {
  generateStars,
  generatePlanet,
  generateStormtrooper,
  generateRGB,
} from './generators.js';

const getRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.autoClear = false;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(
    window.devicePixelRatio ? window.devicePixelRatio : 1
  );
  renderer.setClearColor(0x000000, 0.0);

  return renderer;
};

const initLights = (scene) => {
  const light1 = new THREE.PointLight(0xff0040, 2, 50);
  const light2 = new THREE.PointLight(0x0040ff, 2, 50);
  const light3 = new THREE.PointLight(0x80ff80, 2, 50);
  const mouseLight = new THREE.PointLight(0xffaa00, 2, 50);

  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(mouseLight);

  mouseLight.position.z = 50;

  return { light1, light2, light3, mouseLight };
};

const setMouseLightMovement = (camera, mouse, mouseLight) => {
  addEventListener('mousemove', (event) => {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(mouse.x, -mouse.y, 50);
    vector.unproject(camera);

    mouseLight.position.y = -(-mouse.y + 2) * 23;
    mouseLight.position.x = -mouse.x * 45;
  });
};

const setLightsColor = ({
  light1,
  light2,
  light3,
  pointLightColor1,
  pointLightColor2,
  pointLightColor3,
  mouseLight,
  mouseLightColor,
}) => {
  pointLightColor1 = changeRBG(pointLightColor1);
  pointLightColor2 = changeRBG(pointLightColor2);
  pointLightColor3 = changeRBG(pointLightColor3);
  mouseLightColor = changeRBG(mouseLightColor);

  light1.color.setRGB(
    pointLightColor1.r.value,
    pointLightColor1.g.value,
    pointLightColor1.b.value
  );
  light2.color.setRGB(
    pointLightColor2.r.value,
    pointLightColor2.g.value,
    pointLightColor2.b.value
  );
  light3.color.setRGB(
    pointLightColor3.r.value,
    pointLightColor3.g.value,
    pointLightColor3.b.value
  );
  mouseLight.color.setRGB(
    mouseLightColor.r.value,
    mouseLightColor.g.value,
    mouseLightColor.b.value
  );

  light1.intensity = 0.01;
  light2.intensity = 0.01;
  light3.intensity = 0.01;
  mouseLight.intensity = 0.01;
};

const setLightsPosition = ({ light1, light2, light3 }) => {
  const time = Date.now() * 0.0005;

  light1.position.x = Math.sin(time * 0.7) * 30;
  light1.position.y = Math.cos(time * 0.5) * 25;
  light1.position.z = Math.cos(time * 0.3) * 25;

  light2.position.x = Math.cos(time * 0.3) * 30;
  light2.position.y = Math.sin(time * 0.5) * 25;
  light2.position.z = Math.sin(time * 0.7) * 30;

  light3.position.x = Math.sin(time * 0.7) * 30;
  light3.position.y = Math.cos(time * 0.3) * 25;
  light3.position.z = Math.sin(time * 0.5) * 30;
};

const moveStormtrooper = (scene) => {
  scene.traverse((object) => {
    if (object.name === 'stormtrooper') {
      object.rotation.z -= 0.003;
      object.rotation.x -= 0.0005;
      object.rotation.y -= 0.003;
      if (object.position.x >= -60) {
        object.position.x -= 0.05;
        object.position.y += 0.007;
      }
    }
  });
};

const renderDesktopAnimation = () => {
  const delta = new THREE.Clock().getDelta();

  let mouse = {
    x: undefined,
    y: undefined,
  };

  const cloudRotationSpeed = -0.01;

  const scene = new THREE.Scene({ background: '0x000000' });
  const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.z = 300;

  const renderer = getRenderer();
  const composer = new EffectComposer(renderer);

  const { light1, light2, light3, mouseLight } = initLights(scene);

  setMouseLightMovement(camera, mouse, mouseLight);

  let pointLightColor1 = generateRGB(),
    pointLightColor2 = generateRGB(),
    pointLightColor3 = generateRGB(),
    mouseLightColor = generateRGB();

  const animate = () => {
    requestAnimationFrame(animate);

    setLightsColor({
      light1,
      light2,
      light3,
      pointLightColor1,
      pointLightColor2,
      pointLightColor3,
      mouseLight,
      mouseLightColor,
    });
    setLightsPosition({ light1, light2, light3 });

    moveStormtrooper(scene);

    meshPlanet.rotation.y += 0.0005;
    meshClouds.rotation.y += cloudRotationSpeed * delta;

    composer.render(delta);
    renderer.render(scene, camera);
  };

  const { meshPlanet, meshClouds } = generatePlanet(
    scene,
    camera,
    composer
  );

  const initialRender = () => {
    document.body.appendChild(renderer.domElement);

    generateStars(scene);

    window.addEventListener('resize', () =>
      onWindowResize(camera, renderer)
    );

    setTimeout(() => {
      generateStormtrooper(scene);
    }, 50000);
  };

  initialRender();
  animate();
};

export { renderDesktopAnimation };
