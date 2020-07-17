<template>
  <section>
    <el-col :span="24">
      <div>
        <vue-earth></vue-earth>
      </div>
    </el-col>
  </section>
</template>

<script>
import earth from "../../components/map3d/earth";

export default {
  data() {
    return {};
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