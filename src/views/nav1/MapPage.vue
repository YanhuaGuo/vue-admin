<template>
  <section>
    <el-row>
      <el-col :span="24">
        <button>addPoint</button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <vue-earth :points="staffs"></vue-earth>
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
      staffs:[{
        position: [120.267365,35.98903],
        title: 'Point Test'
    }]
    };
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