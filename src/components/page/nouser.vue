<template>
	<div class="nouser" @click="parent($event)">
		<h3>供应商反退货管理</h3>
		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data1"></DatePicker>
				<span style="float: left">-----</span>
				<DatePicker type="date" placeholder="选择结束时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data2"></DatePicker>
				<div style="float: left;position: relative;">
					<AutoComplete v-model="value3" icon="ios-search" placeholder="请输入供应商名称" style="width:250px" @on-change="onchange"
					 @on-select="select_is">
						<div class="demo-auto-complete-item">
							<Option v-for="option in cityList" :value="option.supplier_name" :key="option.supplier_id">
								<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
							</Option>
						</div>
					</AutoComplete>

				</div>
				<Input v-model="formItem.sku" placeholder="请输入SKU" style="width: 200px;float: left;margin: 0 10px;"
				 @keyup.enter.native="show" />
				 <Input v-model="formItem.packId" placeholder="请输入包裹ID" style="width: 200px;float: left;margin: 0 10px;"
				 @keyup.enter.native="show" />
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="excel">导出Excel</Button>
			</FormItem>
		</Form>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="sort_id" label="序号">
			</el-table-column>
			<el-table-column prop="sku_id" label="SKU">
			</el-table-column>
			<el-table-column prop="package_id" label="包裹ID">
			</el-table-column>

			<el-table-column prop="supplier_name" label="供应商">
			</el-table-column>
			<el-table-column prop="pack_time" label="打包时间">
			</el-table-column>
			<el-table-column prop="add_time" label="反退货时间">
			</el-table-column>
			<el-table-column prop="i_id" label="款式编码">
			</el-table-column>
			<el-table-column prop="remarks" label="备注">
			</el-table-column>

		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'nouser',
		data() {
			return {
				total: 0,
				formItem: {
					data1: '',
					data2: '',
					provide: '',
					sku: '',
					packId:''
				},
				tableData: [],
				pageindex: 1,
				current: 1,
				cityList: [],
				ullist: [],
				sel: false,
				select_id: '',
				list: [],
				value3: '',
				type:0
			}
		},
		methods: {
			onchange(value) {
				this.list = [];
				this.ullist.map((v, index) => {
					let val = v.supplier_name.indexOf(value);
					if (val != -1) {
						let list = {
							supplier_id: v.supplier_id,
							supplier_name: v.supplier_name
						};
						this.list.push(list);
					}
				});
				this.cityList = this.list;
				let list = this.cityList.filter((v) => v.supplier_name == value);
				if (list.length === 0) {
					this.select_id = value;

				} else {
					this.select_id = list[0].supplier_id;
					this.current = 1;
					this.type = 1;
					this.userlist();
				}
				if (!value) {
					this.current = 1;
					this.select_id = '';
					this.type = 1;
					this.userlist();
				}
			},
			select_is(value) {
				if (value === '') {
					let list = this.cityList.filter((v) => v.supplier_name == value);
					this.select_id = list[0].supplier_id;
					this.type = 1;
					this.current = 1;
					this.userlist();
				}
			},
			input() {
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
						params: {}
					})
					.then(res => {
						this.cityList = res.data.data;
						this.ullist = res.data.data;

					});
			},
			parent(event) {
				var el1 = event.currentTarget;
				var el2 = event.target;
				if (el1 != el2) {
					this.sel = false
				}
			},
			int() {
				this.sel = true;
				this.list = [];
				this.ullist.map((v, index) => {
					let val = v.supplier_name.indexOf(this.formItem.provide);
					if (val != -1) {
						let list = {
							supplier_id: v.supplier_id,
							supplier_name: v.supplier_name
						};
						this.list.push(list);
					}
				});
				this.cityList = this.list;
				if (!this.formItem.provide) {
					this.current = 1;
					this.select_id = '';
					this.type = 1;
					this.userlist();
				}
			},
			input1() {
				this.sel = !this.sel;
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
						params: {}
					})
					.then(res => {
						this.cityList = res.data.data;
						this.ullist = res.data.data;
					});
			},
			li_select(index, value) {
				let list = this.cityList.filter((v) => v.supplier_id == value);
				this.formItem.provide = list[0].supplier_name;
				this.select_id = list[0].supplier_id
				this.current = 1;
				this.userlist();
				this.sel = false;
			},
			show(event) {
				this.current = 1;
				this.userlist();
			},
			excel() {
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
				if(this.type === 1){
					window.location.href = "/admin/return/returnexport?start_date=" + datetime + '&end_date=' + datetime1 +
					'&supplier=' + this.select_id + '&type=' + this.type + '&package_id=' + this.formItem.packId;
				}else{
					window.location.href = "/admin/return/returnexport?start_date=" + datetime + '&end_date=' + datetime1 +
					'&supplier=' + this.value3 + '&sku=' + this.formItem.sku + '&type=' + this.type + '&package_id=' + this.formItem.packId;
				}
				
			},
			changeprovide() {

			},
			hangechange(value) {
				this.current = value;
				this.userlist();
			},
			search() {
				this.current = 1;
				this.select_id = this.value3;
				this.type = 0;
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
				this.$axios.get('admin/return/returnlist', {
						params: {
							page: this.current,
							pagesize: 10,
							start_date: datetime,
							end_date: datetime1,
							supplier: this.select_id,
							sku: this.formItem.sku,
							package_id:this.formItem.packId,
							type:this.type
						}
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						this.tableData = res.data.data.data;
						this.total = res.data.data.total;
					})
			},
		},
		mounted() {

		},
		created() {
			document.title = "供应商反退货管理";
			this.input();
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

	.nouser {
		width: 100%;
		height: 100%;
	}

	.div_class {
		position: absolute;
		z-index: 900;
		transform-origin: center top 0px;
		top: 33px;
		left: 0;
		max-height: 200px;
		overflow: auto;
		margin: 5px 0;
		background-color: #FFFFFF;
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
		width: 210px;
	}

	.ul_sel {
		width: 100%;
	}

	.ul_sel>li {
		line-height: 20px;
		text-align: left;
		color: #515a6e;
		cursor: pointer;
		padding: 7px 16px;
		background: #FFFFFF;
		white-space: nowrap;
		font-size: 12px;
	}

	.ul_sel>li:hover {
		background: #f3f3f3;
		transition: background .3s ease-in-out
	}

	.demo-auto-complete-item {
		height: 200px;
		overflow: auto;
	}
</style>
