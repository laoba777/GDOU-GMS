<template>
  <div>
    <!-- 条件查询 -->
    <el-form :inline="true">
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
        <el-select v-model="searchForm.orderState" placeholder="请选择订单状态">
          <el-option label="全部" value=""> </el-option>
          <el-option
            v-for="(item, key) in stateMap"
            :key="key"
            :label="item.text"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getOrderList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetSearch()">重置</el-button>
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
      <el-table-column prop="orderId" label="订单编号" width="130"> </el-table-column>
      <el-table-column prop="orderType" label="预定类型"> </el-table-column>
      <el-table-column prop="orderVenueType" label="场地类型">
      </el-table-column>
      <el-table-column prop="orderVenueId" label="场地编号"> </el-table-column>
      <el-table-column prop="orderVenueName" label="场地名称" width="150">
      </el-table-column>
      <el-table-column prop="orderUserId" label="用户编号" width="130"> </el-table-column>
      <el-table-column prop="orderUserName" label="预定人"> </el-table-column>
      <el-table-column prop="orderPhone" label="联系电话" width="130"> </el-table-column>
      <el-table-column prop="orderPrice" label="预定价格/元">
        <template slot-scope="scope">
          {{ scope.row.orderPrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="orderDate" label="预定日期" width="120">
        <template slot-scope="scope">
          {{ scope.row.orderDate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="orderSt" label="开始时间">
        <template slot-scope="scope"> {{ scope.row.orderSt }}:00 </template>
      </el-table-column>
      <el-table-column prop="orderEd" label="结束时间">
        <template slot-scope="scope"> {{ scope.row.orderEd }}:00 </template>
      </el-table-column>

      <el-table-column prop="orderMktime" label="下单时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.orderMktime | dateFormat("yyyy-MM-dd HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="orderState" label="订单状态" fixed="right">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="stateMap[scope.row.orderState].type"
            v-if="stateMap[scope.row.orderState]"
          >
            {{ stateMap[scope.row.orderState].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="orderId" width="180" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定通过申请吗？"
            @confirm="passOrder(scope.row.orderId)"
          >
            <el-button
              type="success"
              slot="reference"
              :disabled="
                !(hasAuth('venue:order:pass') && scope.row.orderState == 0)
              "
              >通过</el-button
            >
          </el-popconfirm>
          <el-divider direction="vertical"></el-divider>

          <template>
            <el-popconfirm
              title="确定驳回申请吗？"
              @confirm="rejectOrder(scope.row.orderId)"
            >
              <el-button
                type="danger"
                slot="reference"
                :disabled="
                  !(hasAuth('venue:order:reject') && scope.row.orderState == 0)
                "
                >驳回</el-button
              >
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
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
  name: "VenueResReview",
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
      stateMap: {
        0: { text: "待审核", type: "info" },
        1: { text: "已通过", type: "success" },
        2: { text: "已驳回", type: "danger" },
        3: { text: "已使用", type: "success" },
        4: { text: "已失效", type: "danger" },
        5: { text: "已取消", type: "danger" },
      },
    };
  },
  created() {
    this.getOrderList();
    this.getVenueType();
  },
  filters: {
    dateFormat(value, formatString = "yyyy-MM-dd") {
      if (!value) return "";
      return format(new Date(value), formatString);
    },
  },
  methods: {
    // parseISO,
    // dateFormat(date, format) {
    //   return format(date, format);
    // },
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
      this.getOrderList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getOrderList();
    },

    resetSearch() {
      this.searchForm = {};
      this.getOrderList();
    },

    getOrderList() {
      this.$axios
        .get("/venue/order/list", {
          params: {
            venueType: this.searchForm.venueType,
            orderState: this.searchForm.orderState,
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
    passOrder(orderId) {
      let params = {
        orderId: orderId,
        orderState: 1,
      };
      this.$axios.post("/venue/order/update", params).then((res) => {
        this.$notify({
          title: "成功",
          message: "恭喜你，操作成功",
          type: "success",
        });
        this.getOrderList();
      });
    },
    rejectOrder(orderId) {
      let params = {
        orderId: orderId,
        orderState: 2,
      };
      this.$axios.post("/venue/order/update", params).then((res) => {
        this.$notify({
          title: "成功",
          message: "恭喜你，操作成功",
          type: "success",
        });
        this.getOrderList();
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
        this.getOrderList();
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