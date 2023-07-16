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
      <el-form-item>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          :disabled="!hasAuth('contest:info:save')"
          >创建赛事</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button
            type="danger"
            slot="reference"
            :disabled="delBtlStatu"
            v-if="hasAuth('contest:info:delete')"
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
      <el-table-column prop="eqptName" label="器材"> </el-table-column>
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
      <el-table-column prop="venueStatus" label="赛事状态">
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

      <el-table-column
        prop="contestId"
        width="100px"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editHandle(scope.row.contestId)"
            :disabled="!hasAuth('contest:info:update')"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="delHandle(scope.row.contestId)"
            >
              <el-button
                type="text"
                slot="reference"
                :disabled="!hasAuth('contest:info:delete')"
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
      title="创建赛事"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="editForm"  ref="editForm">
        <el-form-item label="赛事名称" prop="contestName" label-width="120px">
          <el-input
            v-model="editForm.contestName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="赛事描述"
          prop="contestDescription"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm.contestDescription"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="contestPhone" label-width="120px">
          <el-input
            v-model="editForm.contestPhone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="比赛日期" prop="contestDate" label-width="120px">
          <el-date-picker
            v-model="editForm.contestDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="场地类别"
          prop="orderVenueType"
          label-width="120px"
        >
          <el-select
            v-model="editFormOrder.orderVenueType"
            placeholder="请选择预约场地类型"
            @change="changeVenueType"
          >
            <el-option
              v-for="item in venueTypeList"
              :key="item.venueTypeId"
              :label="item.venueTypeName"
              :value="item.venueTypeName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场地选择" prop="orderVenueId" label-width="120px">
          <el-select
            v-model="editFormOrder.orderVenueId"
            placeholder="请选择要预约的场地"
            @change="changeVenue"
          >
            <el-option
              v-for="item in venueList"
              :key="item.venueId"
              :label="item.venueName + ' ' + item.venuePrice + '元/小时'"
              :value="item.venueId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="场地使用时间"
          prop="selectedTime"
          label-width="120px"
        >
          <el-select
            v-model="editFormOrder.selectedTime"
            placeholder="请选择"
            multiple
          >
            <el-option
              v-for="slot in timeSlots"
              :key="slot.value"
              :label="slot.value"
              :value="slot.value"
              :disabled="slot.status !== 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="器材"
          prop="contestEqptOrderId"
          label-width="120px"
        >
          <el-input
            v-model="editForm.contestEqptOrderId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="裁判" prop="contestRefereeId" label-width="120px">
          <el-select
            v-model="editForm.contestRefereeId"
            placeholder="请选择赛事裁判"
          >
            <el-option
              v-for="item in refereeList"
              :key="item.refereeId"
              :label="item.refereeName"
              :value="item.refereeId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="比赛时间" prop="venueOpen" label-width="120px">
          <el-time-select
            placeholder="起始时间"
            v-model="editForm.contestStartTime"
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '19:00',
            }"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="editForm.contestEndTime"
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '19:00',
              minTime: editForm.contestStartTime,
            }"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitSaveForm('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--修改对话框-->
    <el-dialog
      title="修改赛事"
      :visible.sync="updateDialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="updateEditForm"  ref="updateEditForm">
        <el-form-item label="赛事名称" prop="contestName" label-width="120px">
          <el-input
            v-model="updateEditForm.contestName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="赛事描述"
          prop="contestDescription"
          label-width="120px"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="updateEditForm.contestDescription"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="contestPhone" label-width="120px">
          <el-input
            v-model="updateEditForm.contestPhone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="比赛日期" prop="contestDate" label-width="120px">
          <el-date-picker
            v-model="updateEditForm.contestDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="裁判" prop="contestRefereeId" label-width="120px">
          <el-select
            v-model="updateEditForm.contestRefereeId"
            placeholder="请选择赛事裁判"
          >
            <el-option
              v-for="item in refereeList"
              :key="item.refereeId"
              :label="item.refereeName"
              :value="item.refereeId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="比赛时间" prop="venueOpen" label-width="120px">
          <el-time-select
            placeholder="起始时间"
            v-model="updateEditForm.contestStartTime"
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '19:00',
            }"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="updateEditForm.contestEndTime"
            :picker-options="{
              start: '09:00',
              step: '00:30',
              end: '19:00',
              minTime: updateEditForm.contestStartTime,
            }"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateEditForm')">取 消</el-button>
        <el-button type="primary" @click="submitUpdateForm('updateEditForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
    
    <script>
import axios from "axios";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
export default {
  name: "ContestManagement",
  data() {
    return {
      searchForm: {},
      tableData: [],
      userInfo: {},
      venueList: [],
      dialogVisible: false,
      updateDialogVisible: false,
      
      venueTypeList: [],
      refereeList: [],

      venueStatus: "0000000000", // 初始值为空，将在获取数据后更新
      timeSlots: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },

      multipleSelection: [],
      
      editForm: {},
      updateEditForm: {
        contestStartTime: null,
        contestEndTime: null,
      },
      delBtlStatu: true,
      
      editFormOrder: {
        orderDate: null,
        orderEd: null,
        orderPhone: null,
        orderPrice: null,
        orderSt: null,
        orderType: null,
        orderUserId: null,
        orderUserName: null,
        orderVenueId: null,
        orderVenueType: null,
        selectedTime: null,
      },
      current: 1,
      size: 10,
      total: 0,
    };
  },
  created() {
    this.getContestList();
    this.getVenueType();
    this.getRefereeList();
    this.getUserInfo();
  },

  filters: {
    dateFormat(value, formatString = "yyyy-MM-dd") {
      if (!value) return "";
      return format(new Date(value), formatString);
    },
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.editFormOrder.orderUserId = res.data.data.id;
        this.editFormOrder.orderUserName = res.data.data.username;
      });
    },
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

    changeVenueType() {
      console.log(this.editFormOrder.orderVenueType);

      this.$axios
        .get("/venue/info/listVenueByType", {
          params: { venueType: this.editFormOrder.orderVenueType },
        })
        .then((res) => {
          this.venueList = [];
          this.venueList = res.data.data;
          this.editFormOrder.orderVenueId = null;
          this.editFormOrder.orderDate = null;
          this.editFormOrder.selectedTime = null;

          console.log(res.data.data);
        });
    },
    changeVenue() {
      console.log(this.editForm.orderDate);
      this.$axios
        .get("/venue/order/getVSInfoByIdDate", {
          params: {
            venueId: this.editFormOrder.orderVenueId,
            // orderDate: format(this.editForm.orderDate, "yyyy-MM-dd"),
            orderDate: this.editForm.contestDate,
          },
        })
        .then((res) => {
          console.log("res.data.data------------");
          console.log(res.data.data);
          this.venueStatus = res.data.data.venueState.vdstateSt;
          this.currentVenue = res.data.data.venueInfo;
          this.setTimeSelect();
        });
    },
    setTimeSelect() {
      const baseTimeSlots = [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
      ];
      this.timeSlots = baseTimeSlots.map((slot, index) => ({
        value: slot,
        status: Number(this.venueStatus.charAt(index)),
      }));
    },
    extractTime(timeSlot) {
      let [start, end] = timeSlot.split(" - ");
      start = parseInt(start.split(":")[0], 10);
      end = parseInt(end.split(":")[0], 10);
      return { start, end };
    },
    submitSaveForm() {
      let times = this.editFormOrder.selectedTime.map(this.extractTime);
      console.log("times");
      console.log(times);
      times.sort((a, b) => a.start - b.start); // 按开始时间排序

      for (let i = 0; i < times.length - 1; i++) {
        if (times[i].end !== times[i + 1].start) {
          this.$message.error("请选择连续的时间段");
          return;
        }
      }

      this.editFormOrder.orderSt = times[0].start;
      this.editFormOrder.orderEd = times[times.length - 1].end;

      this.editFormOrder.orderDate = this.editForm.contestDate;
      this.editFormOrder.orderPrice = 0;
      this.editFormOrder.orderPhone = this.editForm.contestPhone;
      this.editFormOrder.orderType = "比赛";
      this.editForm.contestUserId = this.editFormOrder.orderUserId;

      console.log("editFormOrder");
      console.log(this.editFormOrder);
      console.log("editForm");
      console.log(this.editForm);
      this.editFormOrder.selectedTime=undefined;
      let params = {
        contestInfo:this.editForm,
        venueOrder:this.editFormOrder
      };
      this.$axios
            .post(
              "/contest/info/save",
              params
            )
            .then((res) => {
              this.$notify({
                title: "成功",
                message: "恭喜你，操作成功",
                type: "success",
              });
              this.getContestList();
              this.dialogVisible = false;
              this.resetForm("editForm");
            });
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
      this.updateDialogVisible = false;
      this.editForm = {};
      this.editFormOrder = {
        orderDate: null,
        orderEd: null,
        orderPhone: null,
        orderPrice: null,
        orderSt: null,
        orderType: null,
        orderUserId: null,
        orderUserName: null,
        orderVenueId: null,
        orderVenueType: null,
        selectedTime: '',
      };
      this.updateEditForm= {
        contestStartTime: '',
        contestEndTime: '',
      }
    },
    resetSearch() {
      this.searchForm = {};
      this.getContestList();
    },
    handleClose() {
      this.resetForm("editForm");
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
    getVenueType() {
      this.$axios.get("/venue/info/listVenueType").then((res) => {
        this.venueTypeList = res.data.data;
      });
    },
    getRefereeList() {
      this.$axios.get("/contest/referee/listRefereeName").then((res) => {
        this.refereeList = res.data.data;
      });
    },

    submitUpdateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/contest/info/update",
              this.updateEditForm
            )
            .then((res) => {
              this.$notify({
                title: "成功",
                message: "恭喜你，操作成功",
                type: "success",
              });
              this.getContestList();
              this.updateDialogVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editHandle(contestId) {
      this.$axios.get("/contest/info/infoOne/" + contestId).then((res) => {
        this.updateEditForm = res.data.data;

        this.updateDialogVisible = true;
      });
    },
    delHandle(id) {
      var ids = [];

      if (id) {
        ids.push(id);
      } else {
        this.multipleSelection.forEach((row) => {
          ids.push(row.contestId);
        });
      }

      console.log(ids);

      this.$axios.post("/contest/info/delete", ids).then((res) => {
        this.$notify({
          title: "成功",
          message: "恭喜你，操作成功",
          type: "success",
        });
        this.getContestList();
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