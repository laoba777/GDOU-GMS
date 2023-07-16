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
      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          :disabled="!hasAuth('contest:referee:save')"
          >添加裁判</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('contest:referee:delete')"
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
      <el-table-column prop="refereeId" label="裁判编号"> </el-table-column>
      <el-table-column prop="refereeName" label="裁判姓名" width="120">
      </el-table-column>
      <el-table-column prop="refereePhone" label="联系电话"> </el-table-column>
      <el-table-column prop="refereeInfo" label="裁判信息" width="250">
      </el-table-column>
      <el-table-column prop="refereeGender" label="性别"> </el-table-column>

      <el-table-column prop="refereeType" label="负责类型" width="150">
      </el-table-column>

      <el-table-column prop="refereeStatus" label="裁判状态">
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

      <el-table-column
        prop="refereeId"
        width="100px"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editHandle(scope.row.refereeId)"
            :disabled="!hasAuth('venue:info:update')"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delHandle(scope.row.refereeId)"
            >
              <el-button
                type="text"
                slot="reference"
                :disabled="!hasAuth('contest:referee:delete')"
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
      title="新增裁判"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="裁判姓名" prop="refereeName" label-width="120px">
          <el-input
            v-model="editForm.refereeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="refereePhone" label-width="120px">
          <el-input
            v-model="editForm.refereePhone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="refereeGender" label-width="120px">
          <el-radio-group v-model="editForm.refereeGender">
            <el-radio label="女">女</el-radio>
            <el-radio label="男">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责类型" prop="refereeType" label-width="120px">
          <el-input
            v-model="editForm.refereeType"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="裁判简介" prop="refereeInfo" label-width="120px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm.refereeInfo"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="refereeStatus" label-width="120px">
          <el-radio-group v-model="editForm.refereeStatus">
            <el-radio :label="0">休息中</el-radio>
            <el-radio :label="1">上班中</el-radio>
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";
export default {
  name: "ContestRefereeManage",
  data() {
    return {
      searchForm: {},
      tableData: [],
      dialogVisible: false,
      editFormRules: {
      refereeName: [
        { required: true, message: '请输入裁判姓名', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
      ],
      refereePhone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      refereeGender: [
        { required: true, message: '请选择性别', trigger: 'change' },
      ],
      refereeType: [
        { required: true, message: '请输入负责类型', trigger: 'blur' }
      ],
      refereeInfo: [
        { required: true, message: '请输入裁判简介', trigger: 'blur' },
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
      ],
      refereeStatus: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    },
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

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
      this.editForm = {};
    },
    resetSearch() {
      this.searchForm = {};
      this.getRefereeList();
    },
    handleClose() {
      this.resetForm("editForm");
    },

    getRefereeList() {
      this.$axios
        .get("/contest/referee/list", {
          params: {
            contestName: this.searchForm.condition,
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
    

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/contest/referee/" + (this.editForm.refereeId ? "update" : "save"),
              this.editForm
            )
            .then((res) => {
              this.$notify({
                title: "成功",
                message: "恭喜你，操作成功",
                type: "success",
              });
              this.getRefereeList();
              this.editForm = {};
              this.dialogVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editHandle(refereeId) {
      this.$axios.get("/contest/referee/infoOne/" + refereeId).then((res) => {
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
          ids.push(row.refereeId);
        });
      }

      console.log(ids);

      this.$axios.post("/contest/referee/delete", ids).then((res) => {
        this.$notify({
          title: "成功",
          message: "恭喜你，操作成功",
          type: "success",
        });
        this.getRefereeList();
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