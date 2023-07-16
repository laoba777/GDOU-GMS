<template>
    <div class="main">
        
    <el-row style="padding:10px 0" :gutter="30">
        <el-col :span="50">
          <el-input placeholder="请输入" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getChargStandard">搜索</el-button>
          </el-input>
        </el-col>
        <el-button class="el-icon-refresh-left" @click="getTypeList">刷新</el-button>
    </el-row>

    <el-table :data="typeList" border style="width: 100%">
      <el-table-column prop="typename" label="器材类型"></el-table-column>
      <el-table-column prop="unitprice" label="租用单价(元/个)"></el-table-column>
      <el-table-column prop="totalQty" label="总数量"></el-table-column>
    </el-table>



    </div>


</template>
<script>
    export default {
        name:"EqptRentStandard",
        data(){
            return{
                //器材分类的数据列表，默认为空
                typeList: [],  
                input:''
            }
        },created(){
            this.getTypeList();
        },
        methods:{
            getTypeList() {
				this.$axios.get("/sys/eqpttype/list").then(res => {
					
					// if (res.code != 200) return this.$message.error("获取数据失败");      					
						this.typeList = res.data.data
						console.log("----------------------")
						console.log(res)
						console.log(this.typeList)
					})
			},
            getChargStandard() {
				this.$axios.get("/sys/eqpttype/getEqpt", {
					params: {
						typename:  this.input
					}
				}).then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.typeList = res.data;
						})

					},
        }
    }

</script>
<style scoped>

</style>