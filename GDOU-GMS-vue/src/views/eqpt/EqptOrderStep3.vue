<template>
  <div style="height: 60vh">
    <div class="container">
      <el-result
        icon="success"
        title="预约提交成功"
        subTitle="请等待管理员审核"
      >
        <template slot="extra">
          <el-button type="primary" size="medium" @click="goBack">返回</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>
  <script>
export default {
  name: "EqptOrderStep1",
  data() {
    return {};
  },
  created() {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /*设置容器高度为视口高度，使其在垂直方向上占满整个屏幕*/
}
</style>