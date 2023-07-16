<template>
	<div>
		<el-card>
			<el-row style="padding:10px 0" :gutter="30">
				<el-col :span="50">
					<el-input placeholder="请输入手机号码" v-model="orederQuery" class="input-with-select">
					
						<el-button slot="append" icon="el-icon-search" @click="OrderQuery"></el-button>
					</el-input>
				</el-col>
				<el-button class="el-icon-refresh-left" @click="getRentList">刷新</el-button>
			</el-row>

			<el-table :data="rentList" border style="width: 100%" height="400">
				<el-table-column prop="orderid" label="订单编号" fixed="left" width="90px"></el-table-column>
				<el-table-column prop="eqptname" label="器材名称" width="100px"></el-table-column>
				<el-table-column prop="studentid" label="学号" width="120px"></el-table-column>
				<el-table-column prop="tenant" label="租用人" width="100px"></el-table-column>
				<el-table-column prop="telphone" label="联系电话" width="120px"></el-table-column>
				<el-table-column prop="amount" label="租用数量" width="90px"></el-table-column>
				<el-table-column prop="payamount" label="支付金额" width="90px"></el-table-column>
				<el-table-column prop="renttime" label="申请时间" width="120px"></el-table-column>
				<el-table-column prop="apprtime" label="审核时间" width="120px"></el-table-column>
				<el-table-column prop="verifystate" label="审核状态" width="100px">
				<template slot-scope="scope">
					<el-tag
					:type="scope.row.verifystate=== '未审核' ? 'danger' : 'success'"
					disable-transitions
					>{{scope.row.verifystate}}</el-tag>
				</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="200px">
				<template slot-scope="scope">
					<el-button
					@click="handleEdit(scope.row.eqptname,scope.row.orderid)"
					icon="el-icon-edit-outline"
					plain
					size="small"
					:disabled="scope.row.verifystate != '未审核'"
					>通过</el-button>
					<el-button
					@click="rejectRent(scope.$index,scope.row)"
					icon="el-icon-circle-close"
					plain
					size="small"
					:disabled="scope.row.verifystate != '未审核'"
					type="danger"
					>驳回</el-button>
				</template>
				</el-table-column>
			</el-table>
		</el-card>


		<el-dialog title="器材列表" :visible.sync="dialogTableVisible">
		<el-table
			:data="choseEqptList"
			style="width: 100%"
			:default-sort="{prop: 'eqid', order: 'ascending'}"
			ref="multipleTable"
		>
			<el-table-column type="selection" width="55"></el-table-column>
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
		</el-table>
		<div style="margin-top: 20px">
			<el-button @click="checkBox">通过</el-button>
			<el-button @click="dialogTableVisible=false">取消</el-button>
		</div>
		</el-dialog>
	</div>
</template>

<script>
import global from "../../api/global_var";
	export default {
		name: "EqptVerify",
        data(){
			return {
				rentList: [], //租用申请列表
				choseEqptList: [], //可选的器材列表
				multipleSelection: [], //多选框
				dialogTableVisible: false,
				orederQuery:" "
			}
        },
		created(){
			this.getRentList();
		},
		methods:{
			getRentList() {
				this.$axios.get("/sys/eqptrent/list").then(res => {
					
					// if (res.code !== 200) return this.$message.error("获取数据失败");      					
						this.rentList = res.data.data
						console.log("----------------------")
						console.log(res)
						console.log(this.rentList)
					})
			},
			handleEdit(eqptname, orderid) {
				this.dialogTableVisible = true;
				this.getChoseEqptList(eqptname);
				global.flag = orderid;
				console.log(global.flag + "测试时");
			},
			getChoseEqptList(eqptname) {
				this.$axios.get("/sys/eqptrent/querychoseeqpt", {
					params: {
						eqptname: eqptname
					}
				}).then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.choseEqptList = res.data;
					})
			},
			rejectRent(index,row){
				this.$confirm(
				'是否报修该器材此操作将驳回租用申请, 是否继续?','提示',{
					confirmButtonText:'确定',
					cancelButtonText:'取消',
					type:'warning'
				})
				.then(() => {

					if(row.verifystate !=="驳回"){

						this.$axios.post("/sys/eqptrent/reject", {
            			orderid: row.orderid            
          			})
					.then(response => {
						
						// if (res.code !== 200) return this.$message.error("修改失败");
						// if (res.code === 200) return this.$message.success("修改成功");
						
						this.dialogTableVisible = false;
						this.getRentList();

						this.$message({
						
						message: '恭喜你，操作成功',
						type: 'success',						
					});
					})
					.catch(() =>  {
						this.$message({
							type: "info",
							message: "已取消驳回"
						});
					});

					
					}else{
						
						this.$message({
						type: "info",
						message: "该申请已驳回"
						});

					}
						
					
				})
			},
			
				
				agreeRent() {

					this.$confirm("此操作将无法撤回, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						
							let arr = this.$refs.multipleTable.selection;
							
							let multis = [];
							for (let i = 0; i < arr.length; i++) {
								multis.push(arr[i].eqptid);
							}
							multis.push(global.flag);
							console.log(multis)
							return this.$axios.post("/sys/eqptrent/share", multis);
						})
						.then(() => {
							return this.$axios.post("/sys/eqptrent/agree", {
								orderid: global.flag
								});
						})
							.then(response => {
						const res = response.data;
							if (res.code === 200) {
								this.dialogTableVisible = false;
								this.getRentList();
								this.$message({
								type: "success",
								message: "通过申请!"
							});
							} else {
								this.$message.error("操作失败");
							}
						})
						.catch(res => {
						this.$message.error("取消申请");
						});
					},


				checkBox: function() {
					if (this.$refs.multipleTable.selection.length === 0) {
						this.$message({
						message: "请至少勾选一项，再进行操作",
						type: "warning"
						});
					} else {
						this.agreeRent();
					}
				},

				OrderQuery() {
					this.$axios.get("/sys/eqptrent/orederQuery", {
						params: {
							telphone: this.orederQuery
						}
					}).then(response => {
								const res = response.data;
								// if (res.code !== 200) return this.$message.error("操作失败");
								console.log(res.data);
								this.rentList = res.data;
							})

				}
		}
	}
</script>

<style scoped>


</style>