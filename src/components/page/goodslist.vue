<template>
	<div class="goodslist">
		<h3>异常包裹记录</h3>

		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<Select v-model="formItem.sku" style="width:200px">
					<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data1"></DatePicker>
				<span style="float: left">-----</span>
				<DatePicker type="date" placeholder="选择结束时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data2"></DatePicker>
				<Input v-model="formItem.id" placeholder="请输入包裹ID" clearable style="width: 200px" />
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="excel">导出Excel</Button>
			</FormItem>
		</Form>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="sort_id" label="序号">
			</el-table-column>
			<el-table-column prop="warning_type" label="报警类型">
			</el-table-column>
			<el-table-column prop="package_id" label="包裹ID">
			</el-table-column>
			<el-table-column prop="add_time" label="时间">
			</el-table-column>
			<el-table-column prop="status" label="状态">
			</el-table-column>

		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />

	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'goodslist',
		data() {
			return {
				formItem: {
					data1: '',
					data2: '',
					sku: '',
					id: ''
				},
				cityList: [{
						value: '0',
						label: '全部'
					}, {
						value: '1',
						label: '超时未装车'
					},
					{
						value: '2',
						label: '超时未送达'
					}
				],
				tableData: [],
				total: 0,
				current: 1,
				datetime: '',
				datetime1: ''
			}
		},
		methods: {
			goback() {
				window.history.go(-1);
			},
			excel() {

				this.data();
				window.location.href = "/admin/goods/warninglogexport?start_date=" + this.datetime + '&end_date=' + this.datetime1 +
					'&package_id=' + this.formItem.id + '&warning_type=' + this.formItem.sku +
					'&page=' + this.current + '&pagesize=' + 10;

			},
			search() {
				this.current = 1;
				this.userlist();
			},
			hangechange() {},
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
			},
			hangechange(val) {
				this.current = val;
				this.userlist();
			},
			userlist() {
				this.data();
				this.$axios.get('admin/goods/warninglog', {
						params: {
							page: this.current,
							pagesize: 10,
							start_date: this.datetime,
							end_date: this.datetime1,
							package_id: this.formItem.id,
							warning_type: this.formItem.sku
						}
					})
					.then(res => {
						this.tableData = res.data.data.data;
						this.total = res.data.data.total;
					})
			},
		},
		mounted() {

		},
		created() {
			document.title = "异常包裹记录";
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
