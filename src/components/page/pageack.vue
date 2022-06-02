<template>
	<div class="pageack">
		<h3>近期动态详情</h3>
		<div class="excel">
			<Button type="success" @click="Excel">导出Excel</Button>
			<Button type="error" @click="goback">返回</Button>
		</div>

		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="sort_id" label="序号">
			</el-table-column>
			<el-table-column prop="operate_sn" label="状态">
			</el-table-column>
			<el-table-column prop="package_id" label="包裹编号">
			</el-table-column>
			<el-table-column prop="operate_time" label="时间">
			</el-table-column>
		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'pageack',
		data() {
			return {
				total: 0,
				tableData: [],
				pageIndex: 1,
				current: 1
			}
		},
		methods: {
			Excel() {
				window.location.href = "/admin/index/recentexport";
			},
			goback() {
				window.history.go(-1);
			},
			hangechange(value) {
				this.current = value;
				this.userlist();
			},
			userlist() {
				this.$axios.get('admin/index/packagelist', {
						params: {
							page: this.current,
							pagesize: 10
						}
					})
					.then(res => {
						// console.log(res);
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						if (res.data.code == 1) {
							this.tableData = res.data.data.data;
							this.total = res.data.data.total;
						} else {
							this.tableData = [];
							this.total = 0;
						}

					});
			}
		},
		mounted() {

		},
		created() {
			document.title = "近期动态详情";
			this.userlist();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.pageack {
		width: 100%;
		height: 100%;
	}

	.excel {
		text-align: right;
		margin-bottom: 20px;
	}

	#page {
		text-align: right;
		margin-top: 20px;
	}
</style>
