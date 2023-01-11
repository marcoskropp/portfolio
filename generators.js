import { RenderPass } from './libs/postprocessing/RenderPass.js';
import { FilmPass } from './libs/postprocessing/FilmPass.js';

const generateStars = (scene) => {
  const radius = 25;

  const r = radius,
    starsGeometry = [
      new THREE.BufferGeometry(),
      new THREE.BufferGeometry(),
    ];

  const frontVertex = [];
  const backVertex = [];

  const vertex = new THREE.Vector3();

  for (let i = 0; i < 250; i++) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;

    vertex.multiplyScalar(r);

    frontVertex.push(vertex.x, vertex.y, vertex.z);
  }

  for (let i = 0; i < 1500; i++) {
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar(r);

    backVertex.push(vertex.x, vertex.y, vertex.z);
  }

  starsGeometry[0].setAttribute(
    'position',
    new THREE.Float32BufferAttribute(frontVertex, 3)
  );
  starsGeometry[1].setAttribute(
    'position',
    new THREE.Float32BufferAttribute(backVertex, 3)
  );

  const starsMaterials = [
    new THREE.PointsMaterial({
      color: 0x555555,
      size: 2,
      sizeAttenuation: false,
    }),
    new THREE.PointsMaterial({
      color: 0x555555,
      size: 1,
      sizeAttenuation: false,
    }),
    new THREE.PointsMaterial({
      color: 0x333333,
      size: 2,
      sizeAttenuation: false,
    }),
    new THREE.PointsMaterial({
      color: 0x3a3a3a,
      size: 1,
      sizeAttenuation: false,
    }),
    new THREE.PointsMaterial({
      color: 0x1a1a1a,
      size: 2,
      sizeAttenuation: false,
    }),
    new THREE.PointsMaterial({
      color: 0x1a1a1a,
      size: 1,
      sizeAttenuation: false,
    }),
  ];

  for (let i = 10; i < 30; i++) {
    const stars = new THREE.Points(
      starsGeometry[i % 2],
      starsMaterials[i % 6]
    );

    stars.rotation.x = Math.random() * 6;
    stars.rotation.y = Math.random() * 6;
    stars.rotation.z = Math.random() * 6;
    stars.scale.setScalar(i * 10);

    stars.matrixAutoUpdate = false;
    stars.updateMatrix();

    scene.add(stars);
  }
};

const generatePlanet = (scene, camera, composer) => {
  const textureLoader = new THREE.TextureLoader();
  const radius = 25;
  const tilt = 0.41;
  const cloudsScale = 1.005;

  const materialNormalMap = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 15,
    map: textureLoader.load('./models/earth.jpg'),
    specularMap: textureLoader.load('./models/earth-specular.jpg'),
    normalMap: textureLoader.load('./models/earth-density.jpg'),
    normalScale: new THREE.Vector2(2, -2),
    side: THREE.FrontSide,
    transparent: true,
  });

  const geometry = new THREE.SphereGeometry(radius, 100, 50);

  const meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
  meshPlanet.position.x = 0;
  meshPlanet.rotation.y = 5.6;

  meshPlanet.rotation.z = tilt;

  const earthGroup = new THREE.Group();
  earthGroup.add(meshPlanet);

  const materialClouds = new THREE.MeshLambertMaterial({
    map: textureLoader.load('./models/earth-clouds.png'),
    transparent: true,
  });

  const meshClouds = new THREE.Mesh(geometry, materialClouds);
  meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale);
  meshClouds.rotation.z = tilt;
  meshClouds.position.x = 0;

  earthGroup.add(meshClouds);

  scene.add(earthGroup);

  const renderModel = new RenderPass(scene, camera);
  const effectFilm = new FilmPass(0.35, 0.75, 2048, false);

  composer.addPass(renderModel);
  composer.addPass(effectFilm);

  return { meshPlanet, meshClouds, composer };
};

const generateStormtrooper = (scene) => {
  const loader = new THREE.ColladaLoader();
  let avatar;

  loader.load('./models/stormtrooper.dae', function (collada) {
    avatar = collada.scene;

    avatar.position.x = 35;
    avatar.position.z = 150;
    let light1 = new THREE.PointLight(0xffffff, 2, 50);
    light1.position.z = 10;
    light1.position.y = 10;
    light1.intensity = 1.5;

    let light2 = new THREE.PointLight(0xffffff, 2, 50);
    light2.position.z = 10;
    light2.position.y = -10;
    light2.intensity = 1.5;

    avatar.add(light1);
    avatar.add(light2);

    avatar.rotation.z = 3;
    avatar.name = 'stormtrooper';
    scene.add(avatar);
  });
};

const generateRGB = () => {
  return {
    r: { value: Math.floor(Math.random() * 254), forward: true },
    g: { value: Math.floor(Math.random() * 254), forward: true },
    b: { value: Math.floor(Math.random() * 254), forward: true },
  };
};

const generateInitialSkillProgress = (maxProgress) => {
  let text = `&#60931;`;
  for (let i = 0; i <= maxProgress; i++) {
    text += `&#60929;`;
  }

  text += `&#60930;`;
  return text;
};

const generateTextLoadSkillProgress = (
  actualProgress,
  maxProgress
) => {
  let text = `&#60931;`;

  for (let i = 0; i <= maxProgress; i++) {
    if (i <= actualProgress) {
      text += `&#60932;`;
    }
    if (i > actualProgress) {
      text += `&#60929;`;
    }
  }

  text += `&#60930;`;

  return text;
};

export {
  generateStars,
  generatePlanet,
  generateStormtrooper,
  generateRGB,
  generateInitialSkillProgress,
  generateTextLoadSkillProgress,
};
