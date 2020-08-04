<template>
  <el-dialog title="XX选择器" width="30%" :visible.sync="dialogVisible">
    <span>选择。。。</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClosed">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["dialogVisible"],
  computed: {
    isOpen: {
      get(v) {
        return this.dialogVisible && this.dialogVisible2;
      },
      set(v) {
        console.log("isopen set to :", v);
      },
    },
  },
  watch: {
    dialogVisible: {
      handler(v) {},
      deep: true,
    },
  },
  data() {
    return {
      dialogVisible2: false,
    };
  },
  methods: {
    handleClosed() {
      this.$emit("dialogClosed", this.dialogVisible2);
    },
    handleOk(){
        this.$emit("dialogClosed", this.dialogVisible2);
        this.$emit("selectOk", {
            data:'ok'
        });
    }
  },
  mounted() {
    //console.log("dialogVisible:", this.dialogVisible2);
  },
};
</script>

<style>
</style>