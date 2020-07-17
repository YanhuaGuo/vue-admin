<template>
  <div id="map-container"></div>
</template>
<script>
import * as THREE from "../build/three.module";

import Stats from "./jsm/libs/stats.module.js";

import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { FlyControls } from "./jsm/controls/FlyControls.js";
import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { FilmPass } from "./jsm/postprocessing/FilmPass.js";

export default {
  name: "v-earth",
  methods: {},
  mounted() {
    var mapPanel = document.getElementById("map-container");
    var panelHeight = mapPanel.clientHeight;
    var panelWidth = mapPanel.clientWidth;

    var radius = 6371;
    var tilt = 0.41;
    var rotationSpeed = 0.02;

    var cloudsScale = 1.005;
    var moonScale = 0.23;

    var MARGIN = 0;
    var SCREEN_HEIGHT = panelHeight - MARGIN * 2;
    var SCREEN_WIDTH = panelWidth;

    var camera, controls, scene, renderer, stats;
    var geometry, meshPlanet, meshClouds, meshMoon;
    var dirLight;

    var composer;

    var textureLoader = new THREE.TextureLoader();

    var d,
      dPlanet,
      dMoon,
      dMoonVec = new THREE.Vector3();

    var clock = new THREE.Clock();

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(
        25,
        SCREEN_WIDTH / SCREEN_HEIGHT,
        50,
        1e7
      );
      camera.position.z = radius * 5;

      scene = new THREE.Scene();
      //scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
      // var color = new THREE.Color( 'skyblue' );
      // scene.background=color;

      // dirLight = new THREE.DirectionalLight( 0xffffff );
      // dirLight.position.set( 0,0,1 ).normalize();
      // scene.add( dirLight );

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      hemiLight.position.set(0, 100, 0); //这个也是默认位置
      scene.add(hemiLight);

      var materialNormalMap = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 15,
        map: textureLoader.load(
          require("./textures/planets/earth_atmos_4096.jpg")
        ),
        specularMap: textureLoader.load(
          require("./textures/planets/earth_specular_2048.jpg")
        ),
        normalMap: textureLoader.load(
          require("./textures/planets/earth_normal_2048.jpg")
        ),

        // y scale is negated to compensate for normal map handedness.
        normalScale: new THREE.Vector2(0.85, -0.85)
      });

      // planet

      geometry = new THREE.SphereBufferGeometry(radius, 100, 50);

      meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
      meshPlanet.rotation.y = 0;
      meshPlanet.rotation.z = tilt;
      scene.add(meshPlanet);

      // clouds

      var materialClouds = new THREE.MeshLambertMaterial({
        map: textureLoader.load(
          require("./textures/planets/earth_clouds_1024.png")
        ),
        transparent: true
      });

      meshClouds = new THREE.Mesh(geometry, materialClouds);
      meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale);
      meshClouds.rotation.z = tilt;
      //scene.add( meshClouds );

      // moon

      // var materialMoon = new THREE.MeshPhongMaterial( {

      // 	map: textureLoader.load( require("./textures/planets/moon_1024.jpg") )

      // } );

      // meshMoon = new THREE.Mesh( geometry, materialMoon );
      // meshMoon.position.set( radius * 5, 0, 0 );
      // meshMoon.scale.set( moonScale, moonScale, moonScale );
      // scene.add( meshMoon );

      // stars

      var i,
        r = radius,
        starsGeometry = [
          new THREE.BufferGeometry(),
          new THREE.BufferGeometry()
        ];

      var vertices1 = [];
      var vertices2 = [];

      var vertex = new THREE.Vector3();

      for (i = 0; i < 250; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);

        vertices1.push(vertex.x, vertex.y, vertex.z);
      }

      for (i = 0; i < 1500; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(r);

        vertices2.push(vertex.x, vertex.y, vertex.z);
      }

      starsGeometry[0].setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices1, 3)
      );
      starsGeometry[1].setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices2, 3)
      );

      var stars;
      var starsMaterials = [
        new THREE.PointsMaterial({
          color: 0x555555,
          size: 2,
          sizeAttenuation: false
        }),
        new THREE.PointsMaterial({
          color: 0x555555,
          size: 1,
          sizeAttenuation: false
        }),
        new THREE.PointsMaterial({
          color: 0x333333,
          size: 2,
          sizeAttenuation: false
        }),
        new THREE.PointsMaterial({
          color: 0x3a3a3a,
          size: 1,
          sizeAttenuation: false
        }),
        new THREE.PointsMaterial({
          color: 0x1a1a1a,
          size: 2,
          sizeAttenuation: false
        }),
        new THREE.PointsMaterial({
          color: 0x1a1a1a,
          size: 1,
          sizeAttenuation: false
        })
      ];

      for (i = 10; i < 30; i++) {
        stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);

        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar(i * 10);

        stars.matrixAutoUpdate = false;
        stars.updateMatrix();

        scene.add(stars);
      }

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      mapPanel.appendChild(renderer.domElement);

      //

      // controls = new FlyControls( camera, renderer.domElement );

      // controls.movementSpeed = 1000;
      // controls.domElement = renderer.domElement;
      // controls.rollSpeed = Math.PI / 24;
      // controls.autoForward = false;
      // controls.dragToLook = false;

      var controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
      //

      stats = new Stats();
      mapPanel.appendChild(stats.dom);

      window.addEventListener("resize", onWindowResize, false);

      // postprocessing

      var renderModel = new RenderPass(scene, camera);
      var effectFilm = new FilmPass(0.35, 0.75, 2048, false);

      composer = new EffectComposer(renderer);

      composer.addPass(renderModel);
      composer.addPass(effectFilm);
    }

    function onWindowResize() {
      var mapPanel = document.getElementById("map-container");

      SCREEN_HEIGHT = mapPanel.clientHeight;
      SCREEN_WIDTH = mapPanel.clientWidth;

      camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      camera.updateProjectionMatrix();

      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      composer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    function animate() {
      requestAnimationFrame(animate);

      render();
      stats.update();
    }

    function render() {
      // rotate the planet and clouds

      var delta = clock.getDelta();

      meshPlanet.rotation.y += rotationSpeed * delta;
      meshClouds.rotation.y += 1.25 * rotationSpeed * delta;

      // slow down as we approach the surface

      dPlanet = camera.position.length();

      // dMoonVec.subVectors( camera.position, meshMoon.position );
      // dMoon = dMoonVec.length();

      // if ( dMoon < dPlanet ) {

      // 	d = ( dMoon - radius * moonScale * 1.01 );

      // } else {

      // 	d = ( dPlanet - radius * 1.01 );

      // }

      //controls.movementSpeed = 0.33 * d;
      //controls.update( delta );

      composer.render(delta);
    }
  }
};
</script>
<style lang="scss" scoped>
#map-container {
  width: 100%;
  height: 900px;
  background: #e3e3e3;position: relative;
}
</style>