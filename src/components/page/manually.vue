<template>
	<div class="nouser">
		<h3>退货手动录入</h3>
		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker :value="value2" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择日期范围" style="width: 200px" @on-change="changeTime"></DatePicker>
				<div style="float: left;position: relative;">
					<AutoComplete icon="ios-search" placeholder="请输入供应商名称" style="width:250px" @on-change="onchange"
					@on-select="select_is">
					<div class="demo-auto-complete-item">
						<Option v-for="option in cityList" :value="option.supplier_name" :key="option.supplier_id">
							<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
						</Option>
					</div>
				</AutoComplete>
			</div>
			<Input v-model="formItem.sku" placeholder="请输入SKU" style="width: 200px;float: left;margin: 0 10px;"/>
			<Button type="info" @click="search">查询</Button>
		</FormItem>
	</Form>
	<el-table :data="tableData" border style="width: 100%">
		<el-table-column prop="id" label="包裹ID">
		</el-table-column>
		<el-table-column prop="supplier_name" label="供应商">
		</el-table-column>
		<el-table-column prop="arrive_time" label="到达时间">
		</el-table-column>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<el-button
				size="mini"
				type="danger"
				@click="handleDelete(scope.row)">录入</el-button>
			</template>
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
				formItem: {
					data1: '',
					data2: '',
					supplier: '',
					sku: ''
				},
				value2:"",
				total: 0,
				tableData: [],
				current: 1,
				cityList: [],
				ullist: [],
			}
		},
		created() {
			document.title = "退货手动录入";
			//获取供应商列表
			this.input();
		},
		methods: {
			//获取供应商列表
			input() {
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
					params: {}
				})
				.then(res => {
					this.cityList = res.data.data;
					this.ullist = res.data.data;
				});
			},
			//点击查询
			search() {
				if(this.formItem.supplier == ''){
					this.$Message.error("请选择正确的供应商");
				}else if(this.formItem.sku == ''){
					this.$Message.error("请输入sku");
				}else{
					this.current = 1;
					this.userlist();
				}
			},
			//获取包裹列表
			userlist() {
				this.$axios.get('admin/return/search', {
					params: {
						page: this.current,
						pagesize: 10,
						start_date: this.formItem.data1,
						end_date: this.formItem.data2,
						supplier: this.formItem.supplier,
						sku: this.formItem.sku,
					}
				})
				.then(res => {
					if (res.data.code == 1) {
						this.tableData = res.data.data.data;
						this.total = res.data.data.total;
					}else if(res.data.code == 10000){
						this.$Message.error(res.data.msg);
						this.$router.push({
							path: '/login'
						})
					}else{
						this.$Message.error(res.data.msg);
					}
					
				})
			},
			//点击录入按钮
			handleDelete(row){
				this.$prompt('请输入备注信息', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					if(!value){
						this.$Message.error("请输入备注信息");
					}else{
						this.$axios.post('admin/return/add', {
							package_id:row.id,
							remark:value,
							sku:row.sku_id
						}).then(res => {
							if (res.data.code == 1) {
								this.$Message.success("录入成功");
								this.userlist();
							}else if(res.data.code == 10000){
								this.$Message.error(res.data.msg);
								this.$router.push({
									path: '/login'
								})
							}else{
								this.$Message.error(res.data.msg);
							}

						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消录入'
					});       
				});
			},
			//选择日期范围
			changeTime(date) {
				this.formItem.data1 = date[0];
				this.formItem.data2 = date[1];
			},
			//监听供应商输入
			onchange(value) {
				this.cityList = [];
				let arr = [];
				this.ullist.map(item => {
					if (item.supplier_name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
						arr.push(item);
					}
				});
				this.cityList = arr;
				this.select_is(value);
			},
			//监听选中某一个供应商
			select_is(value) {
				let list = this.ullist.filter((v) => v.supplier_name == value);
				if(list.length > 0){
					this.formItem.supplier = list[0].supplier_id;
				}else{
					this.formItem.supplier = "";
				}
			},
			//切换页码
			hangechange(value) {
				this.current = value;
				this.userlist();
			}
			
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
