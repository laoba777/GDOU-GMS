<template>
  <div>
    <!-- 条件查询 -->
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="searchForm.condition"
          placeholder="裁判姓名/负责类型"
          clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getRefereeList()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetSearch()">重置</el-button>
      </el-form-item>
      
    </el-form>
    <!-- 数据展示表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :max-height="670"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="refereeId" label="裁判编号" width="80"> </el-table-column>
      <el-table-column prop="refereeName" label="裁判姓名" width="120">
      </el-table-column>
      <el-table-column prop="refereeGender" label="性别" width="80"> </el-table-column>
      <el-table-column prop="refereeType" label="负责类型" width="150">
      </el-table-column>
      <el-table-column prop="refereePhone" label="联系电话" width="150"> </el-table-column>
      <el-table-column prop="refereeInfo" label="裁判信息" >
      </el-table-column>


      <el-table-column prop="refereeStatus" label="裁判状态" width="150">
        <template slot-scope="scope">
          <el-tag
            size="small"
            v-if="scope.row.refereeStatus === 1"
            type="success"
            >上班中</el-tag
          >
          <el-tag
            size="small"
            v-else-if="scope.row.refereeStatus === 0"
            type="danger"
            >休息中</el-tag
          >
        </template>
      </el-table-column>

      
    </el-table>
    <!-- 分页插件 -->
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
  name: "ContestRefereeQuery",
  data() {
    return {
      searchForm: {},
      tableData: [],
      
      multipleSelection: [],
      editForm: {},
      delBtlStatu: true,
      current: 1,
      size: 10,
      total: 0,
    };
  },
  created() {
    this.getRefereeList();
  },

  filters: {
    dateFormat(value, formatString = "yyyy-MM-dd") {
      if (!value) return "";
      return format(new Date(value), formatString);
    },
  },
  methods: {
    isContestOver(contestEndTime) {
      return new Date() > new Date(contestEndTime);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("勾选");
      console.log(val);
      this.multipleSelection = val;

      this.delBtlStatu = val.length == 0;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getRefereeList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getRefereeList();
    },

   
    resetSearch() {
      this.searchForm = {};
      this.getRefereeList();
    },
    

    getRefereeList() {
      this.$axios
        .get("/contest/referee/list", {
          params: {
            condition: this.searchForm.condition,
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