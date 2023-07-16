<template>
  <div>
    <!-- 条件查询 -->
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="searchForm.contestName"
          placeholder="赛事名称"
          clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getContestList">搜索</el-button>
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
      <el-table-column prop="contestId" label="赛事编号"> </el-table-column>
      <el-table-column prop="contestName" label="赛事名称" width="160">
      </el-table-column>
      <el-table-column prop="contestDescription" label="赛事描述" width="250">
      </el-table-column>

      <el-table-column prop="contestUserName" label="创建人"> </el-table-column>
      <el-table-column prop="contestPhone" label="联系电话" width="150">
      </el-table-column>
      <el-table-column prop="venueOrderDto.orderVenueName" label="场地名称">
      </el-table-column>
      <el-table-column prop="contestDate" label="比赛日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.contestDate | dateFormat("yyyy-MM-dd") }}
        </template>
      </el-table-column>
      <el-table-column prop="contestStartTime" label="赛事开始时间" width="130">
        <template slot-scope="scope">
          <!-- {{ scope.row.contestStartTime | dateFormat("yyyy-MM-dd HH:mm:ss") }} -->
          {{ scope.row.contestStartTime }}
        </template>
      </el-table-column>
      <el-table-column prop="contestEndTime" label="赛事结束时间" width="130">
        <template slot-scope="scope">
          {{ scope.row.contestEndTime }}
        </template>
      </el-table-column>
      <el-table-column prop="contestRefereeName" label="裁判">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.contestRefereeName">{{
            scope.row.contestRefereeName
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="venueStatus" label="赛事状态" fixed="right">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="!isContestOver(scope.row.contestDate+' '+scope.row.contestEndTime)"
            type="success"
            >进行中</el-tag
          >
          <el-tag size="small" v-else type="danger">已结束</el-tag>
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";
export default {
  name: "ContestQuery",
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
    this.getContestList();
    this.getVenueType();
  },
  filters: {
    dateFormat(value, formatString = "yyyy-MM-dd") {
      if (!value) return "";
      return format(new Date(value), formatString);
    },
  },
  methods: {
    isContestOver(date) {
        console.log(date)
        console.log("---------------------------")
      return new Date() > new Date(date);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getContestList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getContestList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    resetSearch() {
      this.searchForm = {};
      this.getContestList();
    },
    getContestList() {
      this.$axios
        .get("/contest/info/list", {
          params: {
            contestName: this.searchForm.contestName,
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
  },
};
</script>
      
      <style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>