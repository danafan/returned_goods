<template>
	<div class="listgood" @click="parent($event)">
		<h3>退货详情管理</h3>
		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker type="date" placeholder="选择开始时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data1"></DatePicker>
				<span style="float: left">-----</span>
				<DatePicker type="date" placeholder="选择结束时间" style="width: 200px;float: left;margin-right: 10px;" v-model="formItem.data2"></DatePicker>
				<div style="float: left;position: relative;margin-right: 10px;">
					<AutoComplete v-model="value3" icon="ios-search" placeholder="请输入供应商名称" style="width:250px" @on-change="onchange"
					 @on-select="select_is">
						<div class="demo-auto-complete-item">
							<Option v-for="option in cityList" :value="option.supplier_name" :key="option.supplier_id">
								<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
							</Option>
						</div>
					</AutoComplete>

				</div>
				<div style="float: left;position: relative;margin-right: 10px;">
					<AutoComplete v-model="value4" icon="ios-search" placeholder="请输入人员名称" style="width:250px" @on-change="onchanges"
					 @on-select="select_iss">
						<div class="demo-auto-complete-item">
							<Option v-for="option in cityListone" :value="option.name" :key="option.userid">
								<span class="demo-auto-complete-title">{{ option.name }}</span>
							</Option>
						</div>
					</AutoComplete>

				</div>
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="excel()">打印</Button>
			</FormItem>
		</Form>
		<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" ref="multipleSelection">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="sort_id" label="序号">
			</el-table-column>
			<el-table-column prop="supplier_name" label="供应商">
			</el-table-column>
			<el-table-column prop="num" label="退货总数量">
			</el-table-column>
			<el-table-column prop="package_num" label="退货包裹数量">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<Button type="primary" @click="see(scope.$index, scope.row)">查看详情</Button>
				</template>

			</el-table-column>

		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />

		<Modal v-model="modal1" title="退货详情" :closable="false">
			<el-table :data="tableData1" border style="width: 100%" @selection-change="handleSelectionChanges">
				<el-table-column prop="sort_id" label="序号">
				</el-table-column>
				<el-table-column prop="i_id" label="款式编号" width="300">
				</el-table-column>
				<el-table-column prop="num" label="退货总数量">
				</el-table-column>
			</el-table>
			<Page :total="total1" show-total id="page" @on-change="hangechanges" :current="current1" />
			<div slot="footer">
			</div>
		</Modal>



	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'listgood',
		data() {
			return {
				modal1: false,
				total: 0,
				total1: 0,
				current1: 1,
				formItem: {
					data1: '',
					data2: '',
					provide: ''
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
				value4: '',
				multipleSelection: [],
				tableData1: [],
				supplier_id1s: '',
				multipleSelections: [],
				datetime: '',
				datetime1: '',
				cityListone: [],
				ren:[],
				list1:[],
				select_ids:'',
				type:0

			}
		},
		methods: {
			hangechanges(val) {
				this.current1 = val;
				this.pass(this.supplier_id1s);
			},
			handleSelectionChanges() {},
			see(index, row) {
				this.tableData1 = [];
				this.total1 = 0;
				this.modal1 = true;
				this.supplier_id1s = row.supplier_id;
				this.pass(this.supplier_id1s)
			},
			pass(supplier_id) {
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
				this.$axios.get('admin/return/suppliergoods', {
						params: {
							page: this.current1,
							pagesize: 10,
							start_date: datetime,
							end_date: datetime1,
							supplier_id: supplier_id,
							username: this.select_ids,
							type: this.type
						}
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						this.tableData1 = res.data.data.data;
						this.total1 = res.data.data.total;
					})

			},
			handleSelectionChange(val) {
				this.multipleSelections.length = 0;
				this.multipleSelection = val;
				console.log(this.multipleSelection)
				this.multipleSelection.map((v) => {
					this.multipleSelections.push(v.supplier_id);
				})


			},
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
					this.type = 0;
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
			onchanges(value) {
				this.list1 = [];
				this.ren.map((v, index) => {
					let val = v.name.indexOf(value);
					if (val != -1) {
						let list = {
							userid: v.userid,
							name: v.name
						};
						this.list1.push(list);
					}
				});
				this.cityListone = this.list1;
				let list = this.cityListone.filter((v) => v.name == value);
				if (list.length === 0) {
					this.select_ids = value;

				} else {
					this.select_ids = list[0].userid;
					this.type = 1;
					this.current = 1;
					this.userlist();
				}
				if (!value) {
					this.current = 1;
					this.type = 0;
					this.select_ids = ''
					this.userlist();
				}
			},
			select_iss(value) {
				if (value === '') {
					let list = this.cityListone.filter((v) => v.name == value);
					this.select_ids = list[0].userid;
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
					this.select_id = ''
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

				if (this.multipleSelections.length === 0) {
					this.$Message.error('请选择打印退货序号');

				} else {
					let data = new Date(this.formItem.data1);
					this.datetime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
					let data1 = new Date(this.formItem.data2);
					this.datetime1 = data1.getFullYear() + '-' + (data1.getMonth() + 1) + '-' + data1.getDate();
					if (this.datetime == 'NaN-NaN-NaN' || this.datetime == '1970-01-01') {
						this.datetime = '';
					}
					if (this.datetime1 == 'NaN-NaN-NaN' || this.datetime1 == '1970-01-01') {
						this.datetime1 = '';
					};
					if (this.datetime == '' || this.datetime1 == '') {
						this.$Message.error('请选择打印退货时间日期');
						return false;
					};
					if (this.datetime > this.datetime1) {
						this.$Message.error('请正确打印退货时间日期');
						return false;
					};
					let toarr = this.multipleSelections.join('_');
					console.log(toarr)
					window.location.href = "/admin/return/returnprint?start_date=" + this.datetime + '&end_date=' + this.datetime1 +
						'&supplier=' + toarr + '&username=' + this.select_ids + '&type=' + this.type
				};

			},
			changeprovide() {

			},
			hangechange(value) {
				this.current = value;
				this.userlist();
			},
			search() {
				this.current = 1;
				this.type=0;
				this.select_id = this.value3;
				this.select_ids = this.value4;
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
				this.$axios.get('admin/return/supplierlist', {
						params: {
							page: this.current,
							pagesize: 10,
							start_date: datetime,
							end_date: datetime1,
							supplier_id: this.select_id,
							username:this.select_ids,
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
						console.log(res)
					})
			},
			userlist2() {
				this.$axios.get('admin/goods/ajaxuserlist', {
						params: {

						}
					})
					.then(res => {
					
						this.cityListone = res.data.data;
						this.ren = res.data.data;
					});
			},
		},
		mounted() {

		},
		created() {
			document.title = "退货详情管理";
			this.input();
			this.userlist2();
			this.userlist();

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.table_ul {
		width: 20%;
		height: auto;
		box-sizing: border-box;
	}

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
