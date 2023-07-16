<template>
  <div>
    <div>
      <el-alert
        title="请确认信息无误后再缴费！"
        type="warning"
        center
        show-icon
        v-if="isStep2"
      >
      </el-alert>
      <el-alert
        title="请依次按照顺序填写预约信息！"
        type="info"
        center
        show-icon
        v-if="!isStep2"
      >
      </el-alert>
      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item
          label="场地类别"
          prop="orderVenueType"
          label-width="120px"
        >
          <el-select
            v-model="editForm.orderVenueType"
            placeholder="请选择预约场地类型"
            @change="changeVenueType"
            :disabled="isStep2"
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
            v-model="editForm.orderVenueId"
            placeholder="请选择要预约的场地"
            :disabled="isStep2"
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
        <el-form-item label="预约日期" prop="orderDate" label-width="120px">
          <el-date-picker
            v-model="editForm.orderDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="changeDate"
            :disabled="isStep2"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约时间" prop="selectedTime" label-width="120px">
          <el-select
            v-model="editForm.selectedTime"
            placeholder="请选择"
            multiple
            :disabled="isStep2"
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
        <el-form-item label="预约类型" prop="orderType" label-width="120px">
          <el-select
            v-model="editForm.orderType"
            placeholder="请选择预约类型"
            :disabled="isStep2"
          >
            <el-option label="比赛" value="比赛"> </el-option>
            <el-option label="上课" value="上课"> </el-option>
            <el-option label="训练" value="训练"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="教工/学生号"
          prop="orderUserId"
          label-width="120px"
        >
          <el-input
            v-model="editForm.orderUserId"
            autocomplete="off"
            placeholder="教工/学生号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="orderUserName" label-width="120px">
          <el-input
            v-model="editForm.orderUserName"
            autocomplete="off"
            placeholder="请填写姓名"
            :disabled="isStep2"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="orderPhone" label-width="120px">
          <el-input
            v-model="editForm.orderPhone"
            autocomplete="off"
            placeholder="请填写联系电话"
            :disabled="isStep2"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!isStep2">
          <el-button type="primary" @click="submitForm('editForm')"
            >下一步</el-button
          >
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item v-if="isStep2">
          <el-button @click="goBackStep1">上一步</el-button>
          <el-button type="primary" @click="submitForm('editForm')"
            >支付</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 支付弹窗 -->
      <el-dialog
        title="支付"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        style="text-align: center"
      >
        <div class="payment">
          <h2>待支付金额：{{ editForm.orderPrice }} 元</h2>
          <img :src="image" alt="" />
          <el-button type="primary" @click="paySuccess">支付成功</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { format } from "date-fns";
import { tr } from "date-fns/locale";
export default {
  name: "VenueOrderStep1",
  data() {
    return {
      isStep2: false,
      userInfo: {},
      editForm: {
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
      dialogVisible: false,
      venueTypeList: [],
      venueStatus: "0000000000", // 初始值为空，将在获取数据后更新
      timeSlots: [],
      selectedTime: null,
      venueList: [],
      currentVenue: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      image: require("@/assets/WeChatPay.jpg"),
      editFormRules: {
        orderVenueType: [
          { required: true, message: "请选择预约场地类型", trigger: "blur" },
        ],
        orderVenueId: [
          { required: true, message: "请选择要预约的场地", trigger: "blur" },
        ],
        orderDate: [
          { required: true, message: "请选择预约日期", trigger: "blur" },
        ],
        selectedTime: [
          { required: true, message: "请选择预约时间", trigger: "blur" },
        ],
        orderType: [
          { required: true, message: "请选择预约类型", trigger: "blur" },
        ],

        orderUserName: [
          { required: true, message: "请填写姓名", trigger: "blur" },
        ],
        orderPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
    };
  },

  props: {
    changeComponent: {
      type: Function,
      required: true,
    },
    goBack: {
      type: Function,
      required: true,
    },
  },
  created() {},
  mounted() {
    this.getVenueType();
    this.setTimeSelect();
    this.getUserInfo();
  },

  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.editForm.orderUserId = res.data.data.id;
        this.editForm.orderUserName = res.data.data.username;
        this.editForm.orderPhone = res.data.data.phone;
      });
    },
    getVenueType() {
      this.$axios.get("/venue/info/listVenueType").then((res) => {
        this.venueTypeList = res.data.data;
      });
    },
    changeVenueType() {
      console.log(this.editForm.orderVenueType);

      this.$axios
        .get("/venue/info/listVenueByType", {
          params: { venueType: this.editForm.orderVenueType },
        })
        .then((res) => {
          this.venueList = [];
          this.venueList = res.data.data;
          this.editForm.orderVenueId = null;
          this.editForm.orderDate = null;
          this.editForm.selectedTime = null;

          console.log(res.data.data);
        });
    },
    changeDate() {
      console.log(this.editForm.orderDate);
      this.$axios
        .get("/venue/order/getVSInfoByIdDate", {
          params: {
            venueId: this.editForm.orderVenueId,
            // orderDate: format(this.editForm.orderDate, "yyyy-MM-dd"),
            orderDate: this.editForm.orderDate,
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isStep2) {
            let times = this.editForm.selectedTime.map(this.extractTime);
            console.log("times");
            console.log(times); 
            times.sort((a, b) => a.start - b.start); // 按开始时间排序

            for (let i = 0; i < times.length - 1; i++) {
              if (times[i].end !== times[i + 1].start) {
                this.$message.error("请选择连续的时间段");
                return;
              }
            }

            this.editForm.orderSt = times[0].start;
            this.editForm.orderEd = times[times.length - 1].end;

            console.log("this.editForm.orderSt, this.editForm.orderEd");
            console.log(this.editForm.orderSt, this.editForm.orderEd); // 输出：9 10
            console.log(this.currentVenue.venuePrice * times.length)
            this.editForm.orderPrice = this.currentVenue.venuePrice * times.length;
          }

          console.log("this.editForm-------");
          console.log(this.editForm);
          if (!this.isStep2) {
            this.isStep2 = true;
            this.changeComponent();
          } else if (this.isStep2) {
            this.$store.commit("setOrderForm", this.editForm);
            this.dialogVisible = true;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    paySuccess() {
      this.editForm.selectedTime = undefined;
      this.$axios
        .post("/venue/order/save", this.editForm)
        .then((res) => {
          if (res.data.code === 200) {
            this.changeComponent();
            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
            });
          } else {
            this.$notify({
              title: "失败",
              message: "操作失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$notify({
            title: "失败",
            message: "操作失败，请稍后重试",
            type: "error",
          });
        });

      this.dialogVisible = false;
    },
    goBackStep1() {
      this.goBack();
      this.isStep2 = false;
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
    resetForm(formName) {
      this.editForm = {};
    },
    extractTime(timeSlot) {
      let [start, end] = timeSlot.split(" - ");
      start = parseInt(start.split(":")[0], 10);
      end = parseInt(end.split(":")[0], 10);
      return { start, end };
    },
  },
};
</script>
<style scoped>
.el-alert {
  margin-bottom: 20px;
}

.payment {
  margin-left: 20px;
  margin-bottom: 20px;
}
.payment img {
  width: 80%;
  border-radius: 10px;
  margin-bottom: 10px;
}
.payment h2 {
  margin-top: 0px;
}
</style>
