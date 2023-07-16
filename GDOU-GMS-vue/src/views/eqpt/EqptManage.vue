<template>
	<div>
		<el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
			<el-form-item label="器材编号" prop="eqptid">
				<el-input v-model="queryForm.eqptid" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item prop="btn">
				<el-button type="primary" @click="queryEqpt"  icon="el-icon-search">查询</el-button>
				<el-button @click="resetForm" icon="el-icon-refresh">重置</el-button>
			</el-form-item>
		</el-form>

		<el-button type="primary" size="medium" @click="addEqptVisible = true">新增器材</el-button>
    	<el-button size="medium" class="el-icon-refresh-left" @click="getEqptList">刷新</el-button>

		<el-dialog title="新增器材" :visible.sync="addEqptVisible" width="600px" @close="addDialogClosed">
      <!--器材添加表单-->
			<el-form ref="addEqptForm" :model="addEqptForm" label-width="80px" :rules="addEqptRules">
				<el-form-item label="器材编号" prop="eqptid">
				<el-col :span="16">
					<el-input v-model="addEqptForm.eqptid"></el-input>
				</el-col>
				</el-form-item>
				<el-form-item label="器材类型" prop="eqptname">
				<el-col :span="16">
					<el-input v-model="addEqptForm.eqptname" width="30px"></el-input>
				</el-col>
				</el-form-item>
				<el-form-item label="器材状态" prop="eqptstatus">
				<el-select v-model="addEqptForm.eqptstatus" placeholder="请选择器材状态">
					<el-option label="完好" value="完好"></el-option>
					<el-option label="损坏" value="损坏"></el-option>
					<el-option label="保修" value="保修"></el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="租用状态" prop="rentalstatus">
				<el-select v-model="addEqptForm.rentalstatus" placeholder="请选择租用状态">
					<el-option label="未出租" value="未出租"></el-option>
					<el-option label="已出租" value="已出租"></el-option>
				</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="addEqpt('addEqptForm')">确 认</el-button>
					<el-button @click="addEqptVisible = false">取 消</el-button>
				</el-form-item>
			</el-form>

			
		</el-dialog>


		<div class="eqptinfo">
			<el-table
				:data="eqptList"
				border
				style="width: 100%"
				:default-sort="{prop: 'eqid', order: 'ascending'}"
				height="380"
			>
				<el-table-column prop="eqptid" label="器材编号" align="center" sortable></el-table-column>
				<el-table-column prop="eqptname" label="器材类别" align="center"></el-table-column>
				<el-table-column prop="eqptstatus" label="器材状态" align="center">
				<template slot-scope="scope">
					<el-tag
					:type="scope.row.eqptstatus === '完好' ? 'success' : scope.row.eqptstatus ==='损坏'?'danger':'warning'"
					disable-transitions
					>{{scope.row.eqptstatus}}</el-tag>
				</template>
				</el-table-column>
				<el-table-column prop="rentalstatus" label="出租状态" align="center">
				<template slot-scope="scope">
					<el-tag
					:type="scope.row.rentalstatus=== '已出租' ? 'info' : '#409EFF'"
					disable-transitions
					>{{scope.row.rentalstatus}}</el-tag>
				</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="400px">
				<template slot-scope="scope">
					<el-button plain size="small" icon="el-icon-edit-outline" @click="setStatus(scope.row.eqptid)">修改状态</el-button>
					<el-button plain size="small" icon="el-icon-edit-outline" @click="repairEqptByID(scope.row.eqptid)">报修</el-button>
					<el-button @click="deleteClick(scope.row.eqptid)" type="danger" plain icon="el-icon-delete"  size="small">报废</el-button>
				</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "EqptManage",
        data(){
			return {
				//搜索表单的数据绑定对象
				queryForm: {
					eqptid: "",
					eqptname: ""
      			},
				eqptList: [],
				//控制添加表单的隐藏
				addEqptVisible: false,
				//添加器材的表单数据
				addEqptForm: {
					eqptid: "",
					eqptname: "",
					eqptstatus: "",
					rentalstatus: ""
				},
				addEqptRules: {
					eqptid: [
					{ required: true, message: "请输入器材编号", trigger: "blur" }
					],
					eqptname: [
					{ required: true, message: "请输入器材类型", trigger: "blur" }
					],
					eqptstatus: [{ required: true }],
					rentalstatus: [{ required: true }]
				}
			}
        },
		created(){
			this.getEqptList();
		},
		methods:{
			resetForm() {
				this.$refs.queryForm.resetFields();
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.addEqptVisible = false
				this.addEqptForm = {}
			},
			getEqptList() {
				this.$axios.get("/sys/equipment/list").then(res => {
					
					
						this.eqptList = res.data.data
						console.log("----------------------")
						console.log(res)
						console.log(this.eqptList)
					})
			},
			queryEqpt() {
				this.$axios.get("/sys/equipment/queryeqpt", {
					params: {
						eqptid: this.queryForm.eqptid
					}
				}).then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.eqptList = res.data;
						})

					},
			addDialogClosed() {
				this.$refs.addEqptForm.resetFields();
			},
			addEqpt(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/equipment/save',this.addEqptForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										this.getEqptList()
									}
								});

								this.addEqptVisible = false
								this.resetForm(formName)
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			repairEqptByID(eqptid){
				this.$confirm(
				'是否报修该器材？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				})
				.then(() => {
						
					this.$axios.post("/sys/equipment/repair",eqptid)
					}).then(response => {
						
						// if (res.code !== 200) return this.$message.error("修改失败");
						// if (res.code === 200) return this.$message.success("修改成功");
						
						this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getEqptList();
						}
					});
					})
					.catch(() =>  {
						this.$message({
							type: "info",
							message: "已取消报修"
						});
					});
			},
			deleteClick(eqptid){
				this.$confirm(
				'是否永久报废该器材？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				})
				.then(() => {
						
					this.$axios.post("/sys/equipment/delete",eqptid)
					}).then(response => {
						
						// if (res.code !== 200) return this.$message.error("修改失败");
						// if (res.code === 200) return this.$message.success("修改成功");
						
						this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getEqptList();
						}
					});
					})
					.catch(() =>  {
						this.$message({
							type: "info",
							message: "已取消报废"
						});
					});
			},

			setStatus(eqptid){
				this.$confirm(
				'是否修改该器材状态为完好？','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				})
				.then(() => {
						
					this.$axios.post("/sys/equipment/setstatus",eqptid)
					}).then(response => {
						
						// if (res.code !== 200) return this.$message.error("修改失败");
						// if (res.code === 200) return this.$message.success("修改成功");
						
						this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getEqptList();
						}
					});
					})
					.catch(() =>  {
						this.$message({
							type: "info",
							message: "已取消修改"
						});
					});
			},
		}
	}
</script>

<style scoped>

.main {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  height: 30px;
  align-items: center;
}
.demo-form-inline {
  width: 100%;
  height: 50px;
  padding: 10px;
}
.eqptinfo {
  padding: 5px;
}
</style>