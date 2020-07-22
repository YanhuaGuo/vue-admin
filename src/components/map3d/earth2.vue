<template>
  <div id="map-container"></div>
</template>
<script>
window.earth = {};
import * as THREE from "../build/three.module";
import Stats from "./jsm/libs/stats.module.js";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { FlyControls } from "./jsm/controls/FlyControls.js";
import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { FilmPass } from "./jsm/postprocessing/FilmPass.js";

import {drawThreeGeo} from './js/threeGeoJSON';
import {util} from './js/util';
export default {
  name: "v-earth",
  props: [
    'points','x','y' 
  ],
  data() {
    return {
      cachePoints: [],
    }
  },
  watch:{
    x(val){       
        //this.camera.position.set(this.x,this.y,this.z);
    },
    y(val){       
        //this.camera.position.set(this.x,this.y,this.z);
    },
    z(val){       
        //this.camera.position.set(this.x,this.y,this.z);
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
        point.position.copy(this.lglt2xyz(...d.position, earth.radius))
        point.lookAt(new THREE.Vector3())
        point.name = i
        earth.scene.add(point)
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
      
      
      earth.scene = new THREE.Scene();
      earth.scene.background = earth.textureLoader.load( require('./textures/planets/bg.jpg') );
      earth.camera = new THREE.PerspectiveCamera(45, earth.SCREEN_WIDTH / earth.SCREEN_HEIGHT, 0.1, 1000);
      earth.camera.position.set(-31,113,80);
      earth.camera.up.set(0, 0, 1);
      earth.camera.lookAt(earth.scene.position);

       
      
      let material=new THREE.MeshBasicMaterial({
        color:new THREE.Color( "rgb(94, 153, 195)"),
	      // map: this.textureLoader.load(
        //   require("./textures/planets/earth_atmos_2048.jpg")
        // )
      })

      // planet
      let geometry = new THREE.SphereGeometry(50, 42, 42)
      let earthMesh = new THREE.Mesh(geometry, material);
      earthMesh.rotation.y = Math.PI / 2;
      earthMesh.rotation.x = Math.PI / 2;
      earth.scene.add(earthMesh);
      let data = require('./js/word.geojson');
      
      drawThreeGeo(data, 51, 'sphere', {
          color: 0x00ff00,
          transparent: false
      }, earthMesh);

      let china = require('./js/china.json');
      const chinaData = util.decode(china);      
      drawThreeGeo(chinaData, 51, 'sphere', {
        color: 0x00ff00,
        transparent: false
      }, earthMesh)
        
        //cloud
       var materialClouds = new THREE.MeshBasicMaterial({
          map: earth.textureLoader.load(
            require("./textures/planets/earth_atmos_2048.jpg")
          ),
          transparent: true
      });

    
      let meshClouds = new THREE.Mesh(geometry, materialClouds);
      meshClouds.scale.set(earth.cloudsScale, earth.cloudsScale, earth.cloudsScale);
      earth.scene.add( meshClouds );
      meshClouds.rotation.x = this.x;
      meshClouds.rotation.y = this.y;
      earth.meshClouds = meshClouds;

      earth.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha: true});
      earth.renderer.setPixelRatio(window.devicePixelRatio);
      earth.renderer.setSize(earth.SCREEN_WIDTH, earth.SCREEN_HEIGHT);
      earth.mapPanel.appendChild(earth.renderer.domElement);

      //
      var controls = new OrbitControls(earth.camera, earth.renderer.domElement);
      controls.update();
      controls.addEventListener('change',(ev)=>{
        //console.log(ev.target.object)
      });
      //controls.maxZoom = 
      //

      earth.stats = new Stats();
      earth.mapPanel.appendChild(earth.stats.dom);

      window.addEventListener("resize", this.onWindowResize, false);

      // postprocessing

      let renderModel = new RenderPass(earth.scene, earth.camera);
      let effectFilm = new FilmPass(0.35, 0.75, 2048, false);

      earth.composer = new EffectComposer(earth.renderer);

      earth.composer.addPass(renderModel);
      earth.composer.addPass(effectFilm);
      const axesHelper = new THREE.AxisHelper(100);
      earth.scene.add(axesHelper);
    },
    onWindowResize() {
      if(!earth.animateID){
        return;
      }
      let mapPanel = document.getElementById("map-container");

      earth.SCREEN_HEIGHT = mapPanel.clientHeight;
      earth.SCREEN_WIDTH = mapPanel.clientWidth;

      earth.camera.aspect = earth.SCREEN_WIDTH / earth.SCREEN_HEIGHT;
      earth.camera.updateProjectionMatrix();

      earth.renderer.setSize(earth.SCREEN_WIDTH, earth.SCREEN_HEIGHT);
      earth.composer.setSize(earth.SCREEN_WIDTH, earth.SCREEN_HEIGHT);
    },

    animate() {
      earth.animateID = requestAnimationFrame(this.animate);

      this.render();
      earth.stats.update();
      console.log('requestAnimationFrame');
    },

    render() {
      // rotate the planet and clouds
      var delta = earth.clock.getDelta();

      //this.meshClouds.rotation.y += this.rotationSpeed * delta;
      //this.meshClouds.rotation.y += 1.25 * this.rotationSpeed * delta;
      //this.earth.rotation.y += 1.25 * this.rotationSpeed * delta;

      // slow down as we approach the surface
      earth.dPlanet = earth.camera.position.length();

      earth.composer.render(delta);
    }
  },
  destroyed() {
    cancelAnimationFrame(earth.animateID);
    earth.animateID = 0;
    for(let k in earth){
      earth[k] = null;
    }
  },
   
  mounted() {
    
    earth.mapPanel = document.getElementById("map-container");
    earth.panelHeight = earth.mapPanel.clientHeight;
    earth.panelWidth = earth.mapPanel.clientWidth;

    earth.radius = 50;//6371;
    earth.tilt = 0.41;
    earth.rotationSpeed = 0.02;

    earth.cloudsScale = 1.005;
    earth.moonScale = 0.23;

    earth.MARGIN = 0;
    earth.SCREEN_HEIGHT = earth.panelHeight - earth.MARGIN * 2;
    earth.SCREEN_WIDTH = earth.panelWidth;

    

    earth.textureLoader = new THREE.TextureLoader();

    var d,
      //dPlanet,
      dMoon,
      dMoonVec = new THREE.Vector3();

    earth.clock = new THREE.Clock();

    this.init();
    this.render();
    this.animate();

    

    

    
    this.drawPoints();
  
     
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