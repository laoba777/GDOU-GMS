<template>
  <div>
    <div class="stepbar">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="填写预约信息"></el-step>
        <el-step title="缴费"></el-step>
        <el-step title="预约完成"></el-step>
      </el-steps>
    </div>
    <div class="order-container">
      <component
        :is="currentComponent"
        :ref="refs"
        :change-component="changeComponent"
        :goBack="goBack"
      ></component>
      <!-- <el-button type="primary" @click="changeComponent">下一步</el-button> -->
    </div>
  </div>
</template>
<script>
import VenueOrderStep1 from "@/views/venue/VenueOrderStep1";
import VenueOrderStep3 from "@/views/venue/VenueOrderStep3";

export default {
  name: "VenueReservation",
  data() {
    return {
      active: 0,
      currentComponent: "VenueOrderStep1",
      refs: "step1",
    };
  },
  components: {
    VenueOrderStep1,
    VenueOrderStep3,
  },
  created() {},
  methods: {
    changeComponent() {
      this.active++;
      if (this.active === 0) {
        this.currentComponent = VenueOrderStep1;
        this.refs = "step1";
      } else if (this.active === 1) {
        // this.currentComponent = VenueOrderStep2;
        // this.refs = "step2";
      } else if (this.active === 2) {
        this.active++;
        this.currentComponent = VenueOrderStep3;
        this.refs = "step3";
      } else if (this.active === 4) {
        this.active = 0;
        this.currentComponent = VenueOrderStep1;
        // this.refs = "step1";
      }
    },
    goBack() {
      this.active--;
    },
  },
};
</script>
<style scoped>
.stepbar {
  margin: 30px 200px;
}
.order-container {
  width: 50%;
  margin: 0 auto;
  /* margin: 30px 450px; */
}
</style>