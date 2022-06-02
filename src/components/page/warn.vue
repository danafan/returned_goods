<template>
	<div class="warn">
		<h3>报警提示管理</h3>

		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px" v-model="formItem.data1"></DatePicker>
				-----
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px" v-model="formItem.data2"></DatePicker>
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="Excel">导出Excel</Button>
			</FormItem>
		</Form>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="supplier_name" label="供应商名称">
			</el-table-column>
			<el-table-column prop="package_id" label="包裹ID">
			</el-table-column>
			<el-table-column prop="goods_num" label="退货总数量(件)">
			</el-table-column>
			<el-table-column prop="time" label="更新时间">
			</el-table-column>
			<el-table-column prop="status" label="状态">
			</el-table-column>
			<el-table-column prop="type" label="异常类型">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
				</template>
			</el-table-column>

		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'warn',
		data() {
			return {
				total: 0,
				formItem: {
					data1: '',
					data2: ''
				},
				tableData: [],
				pageindex: 1,
				current: 1,
				datetime: '',
				datetime1: ''
			}
		},
		methods: {
			search() {
				this.current = 1;
				this.userlist();
			},
			Excel() {
				this.data();
				window.location.href = "/admin/goods/warningexport?start_date=" + this.datetime + '&end_date=' + this.datetime1
			},
			hangechange(value) {
				this.current = value;
				this.userlist();
			},

			handleEdit(index, row) {
				sessionStorage.setItem('id', row.package_id)
				sessionStorage.setItem('status',0);
				sessionStorage.setItem('type',0);
				this.$router.push({
					path: '/goodsone'
				})
			},
			userlist() {
				this.data();
				this.$axios.get('admin/goods/warninglist', {
						params: {
							page: this.current,
							pagesize: 10,
							start_date: this.datetime,
							end_date: this.datetime1
						}
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						console.log(res)
						this.tableData = res.data.data.data;
						this.total = res.data.data.total;
					});
			},
			data() {
				let data = new Date(this.formItem.data1);
				this.datetime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
				let data1 = new Date(this.formItem.data2);
				this.datetime1 = data1.getFullYear() + '-' + (data1.getMonth() + 1) + '-' + data1.getDate();
				if (this.datetime == 'NaN-NaN-NaN' || this.datetime == '1970-01-01') {
					this.datetime = '';
				}
				if (this.datetime1 == 'NaN-NaN-NaN' || this.datetime1 == '1970-01-01') {
					this.datetime1 = '';
				}
			}
		},
		mounted() {

		},
		created() {
			document.title = "报警提示管理";
			this.userlist();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#page {
		text-align: right;
		margin-top: 20px;
	}
</style>
