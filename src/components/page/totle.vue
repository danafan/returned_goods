<template>
	<div class="totle">
		<h3>数量排名详情</h3>
		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px" v-model="formItem.data1"></DatePicker>
				-----
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px" v-model="formItem.data2"></DatePicker>
				<Select v-model="formItem.selectvalue" style="width:200px" @on-change="changeSelect">
					<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="Excel">导出Excel</Button>
				<Button type="error" @click="goback">返回</Button>
			</FormItem>
		</Form>
		<ul class="ul_item">
			<li v-for="item in title" :key="item">
				{{ item }}
			</li>
		</ul>
		<ul class="ul_items">
			<li v-for="items in tableData" v-if="tableData.length != 0">
				<span>{{ items.sort_id }}</span>
				<span>{{ items.name }}</span>
				<span>{{ items.num }}</span>
			</li>
			<li v-if="tableData.length == 0">
				<span>暂无数据</span>
			</li>
		</ul>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'totle',
		data() {
			return {
				total: 0,
				formItem: {
					data1: '',
					data2: '',
					selectvalue: ''
				},
				cityList: [{
						value: '1',
						label: '商品退货量'
					},
					{
						value: '2',
						label: '退货供应商数量'
					},
					{
						value: '3',
						label: '退货包裹数量'
					}
				],
				tableData: [],
				title: [],
				pageIndex: 1,
				current: 1,
			}
		},
		methods: {
			changeSelect() {
				this.userlist();
			},
			Excel() {
				let data = new Date(this.formItem.data1);
				var datetime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
				let data1 = new Date(this.formItem.data2);
				var datetime1 = data1.getFullYear() + '-' + (data1.getMonth() + 1) + '-' + data1.getDate();
				if (datetime == 'NaN-NaN-NaN' || datetime == '1970-01-01') {
					datetime = '';
				}
				if (datetime1 == 'NaN-NaN-NaN' || datetime1 == '1970-01-01') {
					datetime1 = '';
				};
				window.location.href = "/admin/index/export?start_date=" + datetime + '&end_date=' + datetime1 + '&sort_type=' +
					this.formItem.selectvalue;
			},
			search() {
				this.current = 1;
				this.userlist();
			},
			goback() {
				window.history.go(-1);
			},
			hangechange(value) {
				this.current = value;
				this.userlist();
			},
			userlist() {
				let data = new Date(this.formItem.data1);
				var datetime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
				let data1 = new Date(this.formItem.data2);
				var datetime1 = data1.getFullYear() + '-' + (data1.getMonth() + 1) + '-' + data1.getDate();
				if (datetime == 'NaN-NaN-NaN' || datetime == '1970-01-01') {
					datetime = '';
				}
				if (datetime1 == 'NaN-NaN-NaN' || datetime1 == '1970-01-01') {
					datetime1 = '';
				}
				this.$axios.get('admin/index/sortlist', {
						params: {
							page: this.current,
							pagesize: 10,
							sort_type: this.formItem.selectvalue,
							start_date: datetime,
							end_date: datetime1
						}
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						this.title = res.data.data.title;
						this.tableData = res.data.data.table_data.data;
						this.total = res.data.data.table_data.total;
					});
			},
		},
		mounted() {

		},
		created() {
			document.title = "数量排名详情";
			
			this.formItem.selectvalue = this.cityList[0].value;
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

	.ul_item {
		width: 100%;
		line-height: 40px;
		font-size: 16px;
		font-family: "微软雅黑";
		display: flex;
	}

	.ul_item>li {
		flex: 1;
		border: 1px solid #ebeef5;
		border-right: none;
		color: #909399;
		font-weight: bold;
	}

	.ul_item>li:last-child {
		border-right: 1px solid #ebeef5;
	}

	.ul_items>li {
		display: flex;
		line-height: 40px;
		font-size: 14px;
		color: #606266;
	}

	.ul_items>li>span:last-child {
		border-right: 1px solid #ebeef5;
	}

	.ul_items>li>span {
		flex: 1;
		border: 1px solid #ebeef5;
		border-top: none;
		border-right: none
	}

	.ul_items>li:hover {
		cursor: pointer;
	}
</style>
