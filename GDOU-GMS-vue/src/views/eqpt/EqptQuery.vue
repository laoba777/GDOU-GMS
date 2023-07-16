<template>
	<div>
		<el-col style="padding:10px">
			<el-button type="primary" @click="addTypeVisible=true">添加类别</el-button>
			<el-button class="el-icon-refresh-left" @click="getTypeList">刷新</el-button>
		</el-col>

		<el-dialog
				title="新增赔偿信息"
				:visible.sync="addTypeVisible"
				width="600px"
				@close="addTypeClosed">

			<el-form :model="addTypeform" label-width="80px" ref="addTypeform" :rules="addTypeRules">
				<el-form-item label="器材类别" prop="typename">
					<el-input v-model="addTypeform.typename"></el-input>
				</el-form-item>
				<el-form-item label="租用单价" prop="unitprice">
					<el-input v-model="addTypeform.unitprice"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="addType('addTypeform')">确 认</el-button>
					<el-button @click="addTypeVisible = false">取 消</el-button>
				</el-form-item>
			</el-form>
			

		</el-dialog>

		<el-table :data="typeList" border style="width: 100%;margin-bottom: 20px;">
			<el-table-column prop="typename" label="器材类型"></el-table-column>
			<el-table-column prop="unitprice" label="租用单价(元/个)"></el-table-column>
			<el-table-column prop="totalQty" label="总数量"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
				<el-button
					@click="handleEdit(scope.$index, scope.row)"
					icon="el-icon-edit-outline"
					plain
					size="medium"
				>修改单价</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>


<script>

	export default {
		name: "EqptQuery",
        data(){
			return {
				typeList: [],
				addTypeVisible: false,
				addTypeform: {
					typename: "",
					unitprice: ""
				},
				addTypeRules: {
					typename: [
					{ required: true, message: "请输入器材类型", trigger: "blur" }
					],
					unitprice: [
					{ required: true, message: "请输入租用单价", trigger: "blur" }
					]
				}
			}
			
        },
		created(){
			this.getTypeList();
		},
		methods:{
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.addTypeVisible = false
				this.addTypeform = {}
			},
			getTypeList() {
				this.$axios.get("/sys/eqpttype/list").then(res => {
					
					// if (res.code != 200) return this.$message.error("获取数据失败");      					
						this.typeList = res.data.data
						console.log("----------------------")
						console.log(res)
						console.log(this.typeList)
					})
			},
			addTypeClosed() {
				this.$refs.addTypeform.resetFields();
			},
			addType(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/eqpttype/save',this.addTypeform)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										this.getTypeList()
									}
								});

								this.addTypeVisible = false
								this.resetForm(formName)
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleEdit(index, row) {
				this.$prompt("请输入单价", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					inputPattern: /^[-\+]?\d+$/,
					inputErrorMessage: "请输入正整数"
				})
					.then(({ value }) => {
						var typename = row.typename;
						var unitprice = value;
						console.log(row.typename);
						console.log(value);
						this.$axios.post("/sys/eqpttype/update", { typename: row.typename, unitprice: value });
					}).then(response => {
						
						// if (res.code !== 200) return this.$message.error("修改失败");
						// if (res.code === 200) return this.$message.success("修改成功");
						
						this.dialogTableVisible = false;
						this.getTypeList();
						this.$message({

						message: '恭喜你，操作成功',
						type: 'success',
						
					});
					})
					.catch(() =>  {
						this.$message({
							type: "info",
							message: "已取消修改"
						});
					});

			}
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

</style>