<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-input
						v-model="searchForm.studentid"
						placeholder="输入学号"
						clearable
				>
				</el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getCompensationeList">搜索</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addCompensationVisible = true">新增赔偿</el-button>
				<el-button class="el-icon-refresh-left">刷新</el-button>
			</el-form-item>
		</el-form>


		<!--新增对话框-->
		<el-dialog
				title="新增赔偿信息"
				:visible.sync="addCompensationVisible"
				width="600px"
				@close="addCompensationeClosed">

			<el-form :model="addCompensationForm" :rules="addCompensationRules" ref="addCompensationForm" label-width="100px" class="demo-editForm">
			
				<el-form-item label="器材状态" prop="eqptstatus">
          			<el-input v-model="addCompensationForm.eqptstatus" :disabled="true"></el-input>
        		</el-form-item>
				<el-form-item label="器材编号" prop="eqptid">
					<el-select v-model="addCompensationForm.eqptid" placeholder="请选择">
						<el-option
						v-for="item in options"
						:key="item.eqptid"
						:label="item.label"
						:value="item.eqptid"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学号" prop="studentid">
					<el-input v-model="addCompensationForm.studentid"></el-input>
				</el-form-item>
				<el-form-item label="处理状态" prop="cpststatus">
					<el-input v-model="addCompensationForm.cpststatus"></el-input>
				</el-form-item>
				<el-form-item label="赔偿金额" prop="indemnity">
					<el-input v-model="addCompensationForm.indemnity"></el-input>
				</el-form-item>


				<el-form-item>
					<el-button type="primary" @click="addCompensation('addCompensationForm')">确 认</el-button>
					<el-button @click="addCompensationVisible = false">取 消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>

		<!--赔偿订单-->
		<el-table
				:data="compensationeList"
				style="width: 100%;margin-bottom: 20px;"
				row-key="compensateid"
				border
				stripe>
		
			<el-table-column
					prop="compensateid"
					label="编号"
					sortable
					>
			</el-table-column>
			<el-table-column
					prop="eqptid"
					label="器材编号"
					sortable
					>
			</el-table-column>

			<el-table-column
					prop="studentid"
					label="学号">
			</el-table-column>
			<el-table-column
					prop="cpststatus"
					label="处理状态">
				<template slot-scope="scope">
          			<el-tag
					:type="scope.row.cpststatus === '未赔偿' ? 'danger' :'success'"
					disable-transitions
					>{{scope.row.cpststatus}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column
					prop="indemnity"
					label="赔偿金额">
			</el-table-column>
			<el-table-column
					prop="submissiontime"
					label="新增时间">
			</el-table-column>
			<el-table-column
					label="操作" align="center">
				<template slot-scope="scope">
					<el-button
						@click="handleEdit(scope.$index, scope.row)"
						icon="el-icon-edit-outline"
						plain
						size="medium"
					>赔偿处理</el-button>
        		</template>
			</el-table-column>
		
		
		
		</el-table>
		
		<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[10, 20, 50, 100]"
				:current-page="current"
				:page-size="size"
				:total="total">
		</el-pagination>

	</div>
</template>

<script>
	export default {
		name: "EqptCompensation",
        data(){
			return {
				 //控制添加表单的隐藏
				addCompensationVisible: false,

				searchForm: {},
				total: 0,
				size: 10,
				current: 1,

				// dialogVisible: false,

      			options: [],
      			eqptid: "",
				compensationeList: [],
				
				// tableData: [],

				searchCompensation: "", //查询绑定

				addCompensationForm: {
					eqptstatus: "损坏",
					eqptid: "",
					studentid: "",
					cpststatus: "",
					indemnity: ""
				},
				addCompensationRules: {
					eqptid: [
					{ required: true, message: "请选择器材编号", trigger: "blur" }
					],
					studentid: [
					{ required: true, message: "请输入赔偿者学号", trigger: "blur" }
					],
					cpststatus: [
					{ required: true, message: "请输入赔偿状态", trigger: "blur" }
					],
					indemnity: [
					{ required: true, message: "请输入赔偿金额", trigger: "blur" }
					]

				}
			}
        },
		created(){
			this.getCompensationeList();
    		this.getOptions();
		},
		methods:{
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.size = val
				this.getCompensationeList()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.current = val
				this.getCompensationeList()

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.addCompensationVisible = false
				this.addCompensationForm = {}
			},
			addCompensationeClosed() {
      			this.$refs.addCompensationForm.resetFields();
    		},
			getOptions() {
				this.$axios.get("/sys/equipment/getoptions").then(res => {
					// if (res.code != 200) return this.$message.error("获取数据失败");
      					console.log(res.data);
      					this.options = res.data.data;
				// 
				})
			},
			getCompensationeList() {
				this.$axios.get("/sys/eqptcompensation/list",{
					params: {
						studentid: this.searchForm.studentid,
						current: this.current,
						size: this.size
					}
				}).then(res => {
					// if (res.code != 200) return this.$message.error("获取数据失败");      					
						this.compensationeList = res.data.data.records
						this.size = res.data.data.size
						this.current = res.data.data.current
						this.total = res.data.data.total
					})
			},
			addCompensation(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/eqptcompensation/save',this.addCompensationForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										this.getCompensationeList()
									}
								});

								this.addCompensationVisible = false
								this.resetForm(formName)
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

			handleEdit(index, row) {
				this.$confirm("请确定收到赔款再操作,是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
				.then(() => {
					console.log(row.compensateid);
					if(row.cpststatus === "已处理"){
						this.$message({
						type: "info",
						message: "已处理"
						});
					}else{
						
						this.$axios.post("/sys/eqptcompensation/update", { compensateid: row.compensateid })
							.then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.getCompensationeList();
							this.$message({
								type: "success",
								message: "操作成功!"
							});
							})
								.catch(error => {
						// 错误处理
							console.error(error);
					});
						
					}
						
				});
			}
		}
	}
</script>

<style scoped>

.el-pagination {
		float: right;
		margin-top: 22px;
	}

</style>