<template>
    <div>
        <el-card>
            <el-row style="padding:10px 0">
                <el-col :span="8">
                <el-input placeholder="请输入学号" v-model="olderRentByPhoneInput">
                    <el-button slot="append" icon="el-icon-search" @click="OlderRentbyPhone()"></el-button>
                </el-input>
                </el-col>
            </el-row>

            <el-table :data="rentList" border style="width: 100%" height="400">
                <el-table-column prop="orderid" label="订单编号" fixed="left" ></el-table-column>
                <el-table-column prop="eqptname" label="器材名称" ></el-table-column>
                <el-table-column prop="studentid" label="学号" width="120px"></el-table-column>
                <el-table-column prop="tenant" label="租用人" ></el-table-column>
                <el-table-column prop="telphone" label="联系电话"  width="120px"></el-table-column>
                <el-table-column prop="amount" label="租用数量" ></el-table-column>
                <el-table-column prop="payamount" label="支付金额" ></el-table-column>
                <el-table-column prop="renttime" label="申请时间" ></el-table-column>
                <el-table-column prop="apprtime" label="审核时间" ></el-table-column>
                <el-table-column prop="verifystate" label="审核状态" >
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.verifystate=== '未审核' ? 'danger' : 'success'"
                    disable-transitions
                    >{{scope.row.verifystate}}</el-tag>
                </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button plain size="small" icon="el-icon-edit-outline" @click="QueryShareEpqt(scope.row.orderid)">查看详情</el-button>
				</template>
				</el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="订单器材列表" :visible.sync="dialogTableVisible">
            <el-table
                :data="shareEqptList"
                style="width: 100%"
                :default-sort="{prop: 'eqid', order: 'ascending'}"
                ref="multipleTable"
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
                <el-table-column prop="renttype" label="归还状态" align="center">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.renttype === '已归还' ? 'success' : scope.row.renttype ==='未归还'?'danger':'warning'"
                    disable-transitions
                    >{{scope.row.renttype}}</el-tag>
                </template>
                </el-table-column>
            </el-table>
		</el-dialog>
    </div>
</template>
<script>

    export default {
        name:"OrderQuery",
        data(){
            return{
                rentList: [] ,//租用申请列表
                shareEqptList: [], //分配的器材列表
				dialogTableVisible: false,
                olderRentByPhoneInput:" ",
                userInfo: {
					id: "",
                    phone:""				
				}
            }
        },created(){
            this.getUserInfo(() => {
                this.init();
            });
        },
        methods:{
            getUserInfo(callback) {
                this.$axios.get("/sys/userInfo").then(res => {
                    this.userInfo = res.data.data;
                    console.log(this.userInfo);
                    if (callback) {
                        callback();
                    }
                });
            },
          
            OlderRentbyPhone() {
				this.$axios.get("/sys/eqptrent/olderrentbyphone", {
					params: {
						telphone: this.olderRentByPhoneInput,
                        studentid: this.userInfo.id
					}
				}).then(response => {
                            
							const res = response.data
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.rentList = res.data;
						})

					},
            init() {
				this.$axios.get("/sys/eqptrent/orederQuery", {
					params: {
						studentid: this.userInfo.id
					}
				}).then(response => {
                            console.log(this.userInfo.id);
							const res = response.data;
                            // console.log(response.data);
							// if (res.code !== 200) return this.$message.error("操作失败");
							this.rentList = res.data;
                            console.log(this.rentList);
						})

			},
            QueryShareEpqt(orderid) {
				this.$axios.get("/sys/equipment/queryshareeqpt",{
                    params: {
                    orderid: orderid}
                }).then(response => {
							const res = response.data;
							// if (res.code !== 200) return this.$message.error("操作失败");
							console.log(res.data);
							this.shareEqptList = res.data;
                            this.dialogTableVisible = true; 
						})

					},
            // queryEqptStatus(orderid) {
			// 	this.$axios.get("/sys/equipment/queryeqptstatus",{
            //         params: {
            //         orderid: orderid}
            //     }).then(response => {
			// 				const res = response.data;
			// 				// if (res.code !== 200) return this.$message.error("操作失败");
			// 				console.log(res.data);
			// 				this.rentEqptList = res.data;
            //                 this.dialogTableVisible = true; 
            //                 // for(let i = 0;i < this.rentEqptList.length;i++){
            //                 //     this.shareEqptList.
            //                 // }
			// 			})

			// 		},

        }
    }

</script>