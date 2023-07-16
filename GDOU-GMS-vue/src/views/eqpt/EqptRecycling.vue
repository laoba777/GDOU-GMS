<template>
	<div>
		<el-card>
			<!--搜素框-->
			<el-row style="padding:10px 0" :gutter="30">
				<el-col :span="50">
					<el-input placeholder="请输入" v-model="searchRent" class="input-with-select">
						<el-select v-model="value" slot="prepend" placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							@change="showMessage($event)"
						></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search" @click="queryRent"></el-button>
					</el-input>
				</el-col>
				<el-button class="el-icon-refresh-left" @click="getEqptList">刷新</el-button>
			</el-row>
			<!--列表-->

			<el-table
				:data="eqptList"
				border
				style="width: 100%"
				:default-sort="{prop: 'eqid', order: 'ascending'}"
				height="380"
			>
				<el-table-column prop="eqptid" label="器材编号" align="center" sortable></el-table-column>
				<el-table-column prop="eqptname" label="器材类别" align="center" sortable></el-table-column>
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
				<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button
					plain
					size="small"
					icon="el-icon-bottom"
					@click="eqptRecycling(scope.row.eqptid)"
					>回收</el-button>
				</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: "EqptRecycling",
        data(){
			return {
				options: [
				{
					value: "1",
					label: "器材类型"
				},
				{
					value: "2",
					label: "器材编号"
				}
			],
			value: "", //默认选择为空
			searchRent: "", //查询绑定
			eqptList: []
			}
        },
		created(){
			this.getEqptList();
		},
		methods:{
			getEqptList() {
				this.$axios.get("/sys/eqptrecycling/recyclinglist").then(res => {
					
					// if (res.code !== 200) return this.$message.error("获取数据失败");      					
						this.eqptList = res.data.data
						console.log("----------------------")
						console.log(res)
						console.log(this.eqptList)
					})
			},
			eqptRecycling(eqptid) {
				this.$confirm("是否回收器材?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(() => {
					this.$confirm("器材是否被损坏?", "提示", {
						confirmButtonText: "没有",
						cancelButtonText: "损坏",
						type: "danger"
					})
						.then(() => {
						this.$axios.post("/sys/eqptrecycling/recycling", eqptid)
							.then(response => {
								const res = response.data;
								// if (res.code !== 200) return this.$message.error("操作失败");
								this.getEqptList();
								this.$message({
									type: "success",
									message: "回收成功!"
								});
							})
							.catch(error => {
								console.log(error);
								this.$message.error("操作失败");
							});
						})
						.catch(() => {
							this.$axios.post("/sys/eqptrecycling/damage", eqptid)
								.then(response => {
									const res = response.data;
									// if (res.code !== 200) return this.$message.error("操作失败");
									this.getEqptList();
									this.$message({
										type: "success",
										message: "回收成功!"
									});
								})
								.catch(() => {
									this.$message({
									type: "info",
									message: "已取消回收"
									});
								});
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消回收"
						});
					});
				},
			
			// eqptRecycling(eqptid) {
			// 	this.$confirm("是否回收器材?", "提示", {
			// 		confirmButtonText: "确定",
			// 		cancelButtonText: "取消",
			// 		type: "warning"
			// 	}).then(() => {
			// 		this.$confirm("器材是否损坏?", "提示", {
			// 			confirmButtonText: "没有",
			// 			cancelButtonText: "损坏",
			// 			type: "danger"
			// 		}).then(() => {
			// 			this.$axios.post("/sys/eqptrecycling/recycling", eqptid)
			// 				.then(response => {
			// 					const res = response.data;
			// 					// if (res.code !== 200) return this.$message.error("操作失败");
			// 					this.getEqptList();
			// 					this.$message({
			// 						type: "success",
			// 						message: "回收成功!"
			// 					});
			// 				})
			// 				.catch(error => {
			// 					console.log(error);
			// 					this.$message.error("操作失败");
			// 				});
			// 		}).catch(() => {
			// 			this.$axios.post("/sys/eqptrecycling/damage", eqptid)
			// 				.then(response => {
			// 					const res = response.data;
			// 					// if (res.code !== 200) return this.$message.error("操作失败");
			// 					this.getEqptList();
			// 					this.$message({
			// 						type: "success",
			// 						message: "回收成功!"
			// 					});
			// 				})
			// 				.catch(() => {
			// 					this.$message({
			// 						type: "info",
			// 						message: "已取消回收"
			// 					});
			// 				});
			// 		});
			// 	}).catch(action => {
			// 		if (action === "cancel") {
			// 			this.$message({
			// 				type: "info",
			// 				message: "已取消回收"
			// 			});
			// 		} else if (action === "close") {
			// 			this.$message({
			// 				type: "info",
			// 				message: "已取消回收"
			// 			});
			// 		}
			// 	});
			// },


				queryRent() {
					console.log(this.value);
					console.log(this.searchRent);
					if (this.value == 1) {
						this.$axios.get("/sys/eqptrecycling/querybytype", {
						params: {
							eqptname: this.searchRent
						}
						})
						.then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.eqptList = res.data;
						})
						.catch(error => {
							console.log(error);
							this.$message.error("操作失败");
						});
					} else if (this.value == 2) {
						this.$axios.get("/sys/eqptrecycling/querybyid", {
						params: {
							eqptid: this.searchRent
						}
						})
						.then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.eqptList = res.data;
						})
						.catch(error => {
							console.log(error);
							this.$message.error("操作失败");
						});
					} else {
						this.$message.error("请选择查询类型");
					}
				}
		}
	}
</script>

<style scoped>

.el-select {
  width: 120px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>