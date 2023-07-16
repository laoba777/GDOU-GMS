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
      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          :disabled="!hasAuth('venue:info:save')"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('venue:info:delete')"
            >批量删除</el-button
          >
        </el-popconfirm>
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
      <el-table-column prop="venueId" label="场地编号"> </el-table-column>
      <el-table-column prop="venueType" label="场地类型"> </el-table-column>
      <el-table-column prop="venueName" label="场地名称" width="160"> </el-table-column>
      <el-table-column prop="venueLocation" label="场地位置" width="250">
      </el-table-column>
      <el-table-column prop="venuePrice" label="场地价格/元">
        <template slot-scope="scope">
          {{ scope.row.venuePrice.toFixed(2) }}
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
      <el-table-column prop="venueStatus" label="场地状态" width="90" fixed="right">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.venueStatus === 1" type="success"
            >启用中</el-tag
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

      <el-table-column prop="venueId" width="100px" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editHandle(scope.row.venueId)"
            :disabled="!hasAuth('venue:info:update')"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delHandle(scope.row.venueId)"
            >
              <el-button
                type="text"
                slot="reference"
                :disabled="!hasAuth('venue:info:delete')"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
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

    <!--新增对话框-->
    <el-dialog
      title="新增场地"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="场地名称" prop="venueName" label-width="120px">
          <el-input v-model="editForm.venueName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="场地类别" prop="venueType" label-width="120px">
          <el-select v-model="editForm.venueType" placeholder="请选择场地类型">
            <el-option
              v-for="item in venueTypeList"
              :key="item.venueTypeId"
              :label="item.venueTypeName"
              :value="item.venueTypeName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地位置" prop="venueLocation" label-width="120px">
          <el-input
            v-model="editForm.venueLocation"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="场地价格/元" prop="venuePrice" label-width="120px">
          <el-input
            v-model="editForm.venuePrice"
            autocomplete="off"
            placeholder="支持小数点"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="场地接待量/人"
          prop="venueCapacity"
          label-width="120px"
        >
          <el-input
            v-model="editForm.venueCapacity"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="开放时间" prop="venueOpen" label-width="120px">
          <el-input v-model="editForm.venueOpen" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关闭时间" prop="venueClose" label-width="120px">
          <el-input v-model="editForm.venueClose" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="场地负责人"
          prop="venueManager"
          label-width="120px"
        >
          <el-input
            v-model="editForm.venueManager"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="venueStatus" label-width="120px">
          <el-radio-group v-model="editForm.venueStatus">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">校队预留</el-radio>
            <el-radio :label="4">上课预留</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  name: "VenueManagement",
  data() {
    return {
      searchForm: {},
      tableData: [],
      dialogVisible: false,
      editFormRules: {
        venueName: [
          { required: true, message: "请输入场地名称", trigger: "blur" },
        ],
        venueType: [
          { required: true, message: "请选择场地类别", trigger: "change" },
        ],

        venuePrice: [
          { required: true, message: "请输入场地价格", trigger: "blur" },
        ],
        statu: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      venueTypeList: [],
      multipleSelection: [],
      editForm: {},
      delBtlStatu: true,
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
    handleClose() {
      this.resetForm("editForm");
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

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/venue/info/" + (this.editForm.venueId ? "update" : "save"),
              this.editForm
            )
            .then((res) => {
              this.$notify({
                title: "成功",
                message: "恭喜你，操作成功",
                type: "success",
              });
              this.getVenueList();
              this.dialogVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editHandle(venueId) {
      this.$axios.get("/venue/info/infoOne/" + venueId).then((res) => {
        this.editForm = res.data.data;

        this.dialogVisible = true;
      });
    },
    delHandle(id) {
      var ids = [];

      if (id) {
        ids.push(id);
      } else {
        this.multipleSelection.forEach((row) => {
          ids.push(row.venueId);
        });
      }

      console.log(ids);

      this.$axios.post("/venue/info/delete", ids).then((res) => {
        this.$notify({
          title: "成功",
          message: "恭喜你，操作成功",
          type: "success",
        });
        this.getVenueList();
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