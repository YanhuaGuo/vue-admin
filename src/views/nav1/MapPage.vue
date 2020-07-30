<template>
  <section>
    <el-row>
      <el-col :span="24">
        <button>addPoint</button>
        x:<input type="Number" v-model="x" step="0.01"/>
        y:<input type="Number" v-model="y" step="0.01"/>        
        z:<input type="Number" v-model="z" step="0.01"/>        
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <vue-earth :points="staffs" :x="x" :y="y" :z="z"></vue-earth>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import earth from "../../components/map3d/earth2";

export default {
  data() {
    return {
      x: 1.57,
      y: 0,
      z: 0,
      staffs:[{
        position: [120.267365,35.98903],
        title: 'Point Test'
      }],
      areas: [

      ]
    };
  },
  watch:{
    
  },
  methods: {},
  mounted() {},
  components: {
    "vue-earth": earth
  }
};
</script>

<style scoped>
</style>