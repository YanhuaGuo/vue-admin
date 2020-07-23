<template>
  <div id="map-container"></div>
</template>
<script>
import * as THREE from "../build/three.module";

import * as Gio from "./js/gio.module";
import { drawThreeGeo, drawModel, drawLine } from "./js/threeGeoJSON";
import {util} from './js/util';
export default {
  name: "v-earth",
  props: ["points", "x", "y"],
  data() {
    return {
      configs: {
        control: {
          stats: true,
          disableUnmentioned: false,
          lightenMentioned: true,
          inOnly: true,
          outOnly: true,
          initCountry: "CN",
          halo: true,
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
      },
    };
  },
  watch: {},
  methods: {
    drawProvince(){
      let china = require('./js/china.json');
      const chinaData = util.decode(china);      
      // drawThreeGeo(chinaData, 101, 'sphere', {
      //   color: 0x00ff00,
      //   transparent: false
      // }, globe.getScene().children[5]);
    }
  },

  destroyed() {},

  mounted() {
    let container = document.getElementById("map-container");
    window.globe = new Gio.Controller(container, this.configs);
    // 初始化并渲染地球
    window.globe.init();
    this.drawProvince();
  }, //end mounted
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