<template>
  <el-tabs
    v-model="editableTabsValue"
    type="border-card"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name">
		<!-- <router-view/> -->
	  </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Tabs",
  data() {
    return {
      // editableTabsValue: this.$store.state.menus.editableTabsValue,
      // editableTabs: this.$store.state.menus.editableTabs
    };
  },
  computed: {
    editableTabs: {
      get() {
        return this.$store.state.menus.editableTabs;
      },
      set(val) {
        this.$store.state.menus.editableTabs = val;
      },
    },
    editableTabsValue: {
      get() {
        return this.$store.state.menus.editableTabsValue;
      },
      set(val) {
        this.$store.state.menus.editableTabsValue = val;
      },
    },
  },
  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;

      if (activeName === "Index") {
        return;
      }

      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);

      this.$router.push({ name: activeName });
    },
    clickTab(target) {
      this.$router.push({ name: target.name });
    },
  },
};
</script>

<style scoped>
/* .el-tabs {
  height: 41px;
  background: #f0f0f0;
  -webkit-box-shadow: 0 0 3px 2px hsla(0, 0%, 39.2%, 0.1) inset;
  box-shadow: inset 0 0 3px 2px hsla(0, 0%, 39.2%, 0.1);
}
.el-tab-pane{
  background: #fff;
} */
.el-tab-pane{

}
.el-tabs--border-card > .el-tabs__header {
    box-shadow: none !important;
}

</style>