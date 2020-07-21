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
        let point = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshBasicMaterial({
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
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
        50,
        1e7
      );
      this.camera.position.z = this.radius * 5;

      this.scene = new THREE.Scene();
      //scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
      // var color = new THREE.Color( 'skyblue' );
      // scene.background=color;

      // dirLight = new THREE.DirectionalLight( 0xffffff );
      // dirLight.position.set( 0,0,1 ).normalize();
      // scene.add( dirLight );

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
      hemiLight.position.set(0, 100, 0); //这个也是默认位置
      this.scene.add(hemiLight);

      var materialNormalMap = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        wireframe: true,
        shininess: 15,
        map: this.textureLoader.load(
          require("./textures/planets/earth_atmos_2048.jpg")
        ),
        specularMap: this.textureLoader.load(
          require("./textures/planets/earth_specular_2048.jpg")
        ),
        normalMap: this.textureLoader.load(
          require("./textures/planets/earth_normal_2048.jpg")
        ),

        // y scale is negated to compensate for normal map handedness.
        normalScale: new THREE.Vector2(0.85, -0.85)
      });
      
      let material=new THREE.MeshBasicMaterial({
	      map: this.textureLoader.load(
          require("./textures/planets/earth_atmos_2048.jpg")
        )
	      //color:new THREE.Color( "rgb(94, 153, 195)")
      })

      // planet

      this.geometry = new THREE.SphereBufferGeometry(this.radius, 100, 50);

      this.meshPlanet = new THREE.Mesh(this.geometry, material);
      this.meshPlanet.rotation.y = 0;
      this.meshPlanet.rotation.z = this.tilt;
      this.scene.add(this.meshPlanet);
      // clouds

      // var materialClouds = new THREE.MeshLambertMaterial({
      //   map: this.textureLoader.load(
      //     require("./textures/planets/earth_clouds_1024.png")
      //   ),
      //   transparent: true
      // });

      // this.meshClouds = new THREE.Mesh(this.geometry, materialClouds);
      // this.meshClouds.scale.set(this.cloudsScale, this.cloudsScale, this.cloudsScale);
      // this.meshClouds.rotation.z = this.tilt;
      //this.scene.add( this.meshClouds );

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
        r = this.radius,
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

        this.scene.add(stars);
      }

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.mapPanel.appendChild(this.renderer.domElement);

      //

      // controls = new FlyControls( camera, renderer.domElement );

      // controls.movementSpeed = 1000;
      // controls.domElement = renderer.domElement;
      // controls.rollSpeed = Math.PI / 24;
      // controls.autoForward = false;
      // controls.dragToLook = false;

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