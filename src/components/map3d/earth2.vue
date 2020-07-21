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

import {drawThreeGeo} from './js/threeGeoJSON';
export default {
  name: "v-earth",
  props: {
    points: Array,    
  },
  data() {
    return {
      camera:null, 
      controls:null, 
      renderer:null,  
      stats:null, 
      geometry:null,  
      meshPlanet:null,  
      meshClouds:null,  
      meshMoon:null, 
      dirLight:null, 
      composer:null, 
      dPlanet:null,
      MARGIN:0,
      rotationSpeed:0.02,

      cachePoints: [],
    }
  },
  methods: {
    drawPoints() {
      if(!this.points.length){
        return;
      }
      //console.log('start draw points');
      for(let [i, d] of this.points.entries()){
        let point = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshBasicMaterial({
            color:0xff0000
        }));
        point.position.copy(this.lglt2xyz(...d.position, this.radius))
        point.lookAt(new THREE.Vector3())
        point.name = i
        this.scene.add(point)
        this.cachePoints.push(point)
      }
    },
    lglt2xyz (lg, lt, r) {
        lg = lg * Math.PI / 180
        lt = lt * Math.PI / 180
        return new THREE.Vector3(
            Math.cos(lg) * Math.cos(lt) * r,
            Math.sin(lg) * Math.cos(lt) * r,
            Math.sin(lt) * r
        );
    },
    init() {
      // this.camera = new THREE.PerspectiveCamera(
      //   45,
      //   this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
      //   50,
      //   1e7
      // );
      // this.camera.position.z = this.radius * 5;

      this.scene = new THREE.Scene();
      this.scene.background = this.textureLoader.load( require('./textures/planets/bg.jpg') );
      this.camera = new THREE.PerspectiveCamera(45, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 0.1, 1000);
      this.camera.position.set(200, 0, 0);
      this.camera.up.set(0, 0, 1);
      this.camera.lookAt(this.scene.position);

       
      
      let material=new THREE.MeshBasicMaterial({
        color:new THREE.Color( "rgb(94, 153, 195)"),
	      // map: this.textureLoader.load(
        //   require("./textures/planets/earth_atmos_2048.jpg")
        // )
      })

      // planet
      let geometry = new THREE.SphereGeometry(50, 42, 42)
      this.earth = new THREE.Mesh(geometry, material);
      this.earth.rotation.y = Math.PI / 2;
      this.earth.rotation.x = Math.PI / 2;
      this.scene.add(this.earth);
      let data = require('./js/word.geojson');
      console.log('111');
          drawThreeGeo(data, 51, 'sphere', {
              color: 0x00ff00,
              transparent: false
          }, this.earth)
        
        //cloud
       var materialClouds = new THREE.MeshBasicMaterial({
          map: this.textureLoader.load(
            require("./textures/planets/earth_atmos_2048.jpg")
          ),
          transparent: true
      });

      this.meshClouds = new THREE.Mesh(geometry, materialClouds);
      this.meshClouds.scale.set(this.cloudsScale, this.cloudsScale, this.cloudsScale);
      this.scene.add( this.meshClouds );

      this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha: true});
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.mapPanel.appendChild(this.renderer.domElement);

      //
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.update();
      //

      this.stats = new Stats();
      this.mapPanel.appendChild(this.stats.dom);

      window.addEventListener("resize", this.onWindowResize, false);

      // postprocessing

      var renderModel = new RenderPass(this.scene, this.camera);
      var effectFilm = new FilmPass(0.35, 0.75, 2048, false);

      this.composer = new EffectComposer(this.renderer);

      this.composer.addPass(renderModel);
      this.composer.addPass(effectFilm);
    },
    onWindowResize() {
      var mapPanel = document.getElementById("map-container");

      this.SCREEN_HEIGHT = mapPanel.clientHeight;
      this.SCREEN_WIDTH = mapPanel.clientWidth;

      this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.composer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    },

    animate() {
      requestAnimationFrame(this.animate);

      this.render();
      this.stats.update();
    },

    render() {
      // rotate the planet and clouds

      var delta = this.clock.getDelta();

      //this.meshPlanet.rotation.y += this.rotationSpeed * delta;
      //this.meshClouds.rotation.y += 1.25 * this.rotationSpeed * delta;

      // slow down as we approach the surface
      this.dPlanet = this.camera.position.length();

      this.composer.render(delta);
    }
  },
  created() {
    
  },
  beforeMount() {
    
  },
  mounted() {
    
    this.mapPanel = document.getElementById("map-container");
    this.panelHeight = this.mapPanel.clientHeight;
    this.panelWidth = this.mapPanel.clientWidth;

    this.radius = 50;//6371;
    this.tilt = 0.41;
    this.rotationSpeed = 0.02;

    this.cloudsScale = 1.005;
    this.moonScale = 0.23;

    this.MARGIN = 0;
    this.SCREEN_HEIGHT = this.panelHeight - this.MARGIN * 2;
    this.SCREEN_WIDTH = this.panelWidth;

    

    this.textureLoader = new THREE.TextureLoader();

    var d,
      //dPlanet,
      dMoon,
      dMoonVec = new THREE.Vector3();

    this.clock = new THREE.Clock();

    this.init();
    this.render();
    this.animate();

    

    

    
    this.drawPoints();
    console.log('camera.position')
    console.log(this.camera.position)
    console.log(this.cachePoints[0].position)
  }//end mounted
};
</script>
<style lang="scss" scoped>
#map-container {
  width: 100%;
  height: 900px;
  background: #e3e3e3;position: relative;
}
</style>