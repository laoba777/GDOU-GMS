<template>
  <div>
    <!-- 条件查询 -->
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="searchForm.venueName"
          placeholder="场地名称"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.venueType" placeholder="请选择场地类型">
          <el-option label="全部" value=""> </el-option>
          <el-option
            v-for="item in venueTypeList"
            :key="item.venueTypeId"
            :label="item.venueTypeName"
            :value="item.venueTypeName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getVenueList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetSearch()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据展示表格 -->
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      :max-height="670"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="venueId" label="场地编号"> </el-table-column>
      <el-table-column prop="venueType" label="场地类型"> </el-table-column>
      <el-table-column prop="venueName" label="场地名称" width="160">
      </el-table-column>
      <el-table-column prop="venueLocation" label="场地位置" width="250">
      </el-table-column>
      <el-table-column prop="venuePrice" label="场地价格/元">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.venuePrice.toFixed(2) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="venueCapacity" label="场地接待量/人">
      </el-table-column>
      <el-table-column prop="venueOpen" label="开放时间">
        <template slot-scope="scope"> {{ scope.row.venueOpen }}:00 </template>
      </el-table-column>
      <el-table-column prop="venueClose" label="关闭时间">
        <template slot-scope="scope"> {{ scope.row.venueClose }}:00 </template>
      </el-table-column>
      <el-table-column prop="venueManager" label="场地负责人">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.venueManager">{{
            scope.row.venueManager
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="venueStatus" label="场地状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.venueStatus === 1" type="success"
            >可预约</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.venueStatus === 0"
            type="danger"
            >不可用</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.venueStatus === 2"
            type="danger"
            >校队预留</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.venueStatus === 3"
            type="danger"
            >上课预留</el-tag
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="current"
      :page-size="size"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
    
    <script>
export default {
  name: "VenueCharge",
  data() {
    return {
      searchForm: {},
      tableData: [],
      venueTypeList: [],
      current: 1,
      size: 10,
      total: 0,
    };
  },
  created() {
    this.getVenueList();
    this.getVenueType();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getVenueList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getVenueList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    resetSearch() {
      this.searchForm = {};
      this.getVenueList();
    },
    getVenueList() {
      this.$axios
        .get("/venue/info/list", {
          params: {
            venueName: this.searchForm.venueName,
            venueType: this.searchForm.venueType,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          this.tableData = res.data.data.records;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;
        });
    },
    getVenueType() {
      this.$axios.get("/venue/info/listVenueType").then((res) => {
        this.venueTypeList = res.data.data;
      });
    },
  },
};
</script>
    
    <style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>