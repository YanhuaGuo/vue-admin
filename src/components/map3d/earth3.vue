<template>
  <div id="map-container"></div>
</template>
<script>
import * as THREE from "../build/three.module.js";
import * as GIO from "./js/gio.module.js";
import { drawThreeGeo, drawModel, drawLine } from "./js/threeGeoJSON";
import {util} from './js/util';
export default {
  name: "v-earth",
  props: ["points", "x", "y"],
  data() {
    return {
      
    }
  },
  watch: {},
  methods: {
    drawProvince(){
      
      //  let andyMesh = giojs.getScene().children[3].getObjectByName('sphere')       
      //  let china = require('./js/china.json');
      //  const chinaData = util.decode(china);      
      //  drawThreeGeo(chinaData, 110, 'sphere', {
      //    color: 0xff0000,
      //    transparent: false
      //  }, andyMesh);
       
    }
  },

  destroyed() {},

  mounted() {
    let container = document.getElementById("map-container");
    let controller = new GIO.Controller(container);
    controller.configure({
      control: {
          stats: true,
          disableUnmentioned: false,
          lightenMentioned: true,
          inOnly: true,
          outOnly: true,
          initCountry: "CN",
          halo: false,
        },

        color: {
          surface: 0xffffff,
          selected: 0x00ff00,
          in: 0x154492,
          out: 0xdd380c,
          halo: 0xffffff,
          background: null,
        },

        brightness: {
          ocean: 0.5,
          mentioned: 0.5,
          related: 0.5,
        }
      });
    // 初始化并渲染地球
    controller.init();
  
    // let axesHelper = new THREE.AxisHelper(200);
    // let scene = controller.getScene()
    // if(scene!=null){
    //   console.log('scene.add(axesHelper);')
    //   scene.add(axesHelper);
    // }
    this.drawProvince();
    window.giojs = controller;
    console.log(controller)
  }//end mounted
};
</script>
<style lang="scss" scoped>
#map-container {
  width: 100%;
  height: 900px;
  background: #e3e3e3;
  position: relative;
}
</style>