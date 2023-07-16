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
          label="器材"
          prop="eqptname"
          label-width="120px"
        >
          <el-select
            v-model="editForm.eqptname"
            placeholder="请选择类型"
            @change="changeEqptType"
            :disabled="isStep2"
          >
          <el-option
              v-for="item in options"
              :key="item.typename"
              :value="item.typename"
              :label="item.typename+'--'+item.unitprice+'元/个'+'--剩余'+item.totalQty+'个'"
            ></el-option>

          </el-select>
        </el-form-item>
        
        <el-form-item label="租用数量" prop="amount" label-width="120px">
          <el-input-number v-model="editForm.amount" :min="1" :max="10" :disabled="isStep2"  @change="getToTal()"></el-input-number>
        </el-form-item>
        
        <el-form-item
          label="教工/学生号"
          prop="studentid"
          label-width="120px"
        >
          <el-input
            v-model="editForm.studentid"
            autocomplete="off"
            placeholder="教工/学生号"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          label="支付金额"
          prop="payamount"
          label-width="120px"
        >
          <el-input
            v-model="editForm.payamount"
           
            disabled
          ></el-input>

        </el-form-item>
        <el-form-item label="姓名" prop="tenant" label-width="120px">
          <el-input
            v-model="editForm.tenant"
            autocomplete="off"
            placeholder="请填写姓名"
            :disabled="isStep2"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telphone" label-width="120px">
          <el-input
            v-model="editForm.telphone"
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
  name: "EqptOrderStep1",
  data() {
    return {
      isStep2: false,
      userInfo: {},
      editForm: {
        
        telphone: null,
        amount: 0,
        payamount: null,
        studentid: null,
        tenant: null,
        eqptname: null,

      },
      dialogVisible: false,

    


      value: "",

      payamount: null,

      amount: 1,
      options: [], //器材类型表
      currentEqpt: {},
      
      image: require("@/assets/WeChatPay.jpg"),

      editFormRules: {
        eqptname: [
          { required: true, message: "请选择器材类型", trigger: "blur" }
        ],
        amount: [{ required: true, message: "请选择数量", trigger: "blur" }],

        tenant: [{ required: true, message: "请填写姓名", trigger: "blur" }],

        telphone: [
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
    this.getEqptType();
    this.getUserInfo();
  },

  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        this.editForm.studentid = res.data.data.id;
        this.editForm.tenant = res.data.data.username;
        this.editForm.telphone = res.data.data.phone;
      });
    },
    getEqptType() {
      this.$axios.get("/sys/eqpttype/list").then((res) => {
        this.options = res.data.data;
      });
    },


    

    getToTal(){
      const amount = this.editForm.amount;

      // 获取选中的选项对象
      const selectedOption = this.options.find(
        (item) => item.typename === this.editForm.eqptname
      );

      // 获取选项对象的 unitprice 值
      const unitprice = selectedOption ? selectedOption.unitprice : '';

      // 计算支付总额
      const payamount = amount * unitprice;

      // 在控制台打印支付总额
      console.log(payamount);

      this.payamount = payamount;

      this.editForm.payamount=payamount;
    },

    changeEqptType() {
      console.log(this.editForm.eqptname);

      this.$axios
        .get("/sys/eqpttype/getEqpt", {
          params: { typename: this.editForm.eqptname },
        })
        .then((res) => {
          this.options = [];
          this.options = res.data.data;         
          console.log(res.data.data);
        });
    },
    submitForm(formName) {
      // this.editForm.orderPrice = this.currentEqpt.EqptPrice;
      console.log("this.editForm-------");
      console.log(this.editForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
      this.$axios
        .post("/sys/eqptrent/save", this.editForm)
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
    
    resetForm(formName) {
      this.editForm = {};
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
}
</style>
