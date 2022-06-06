<template>
	<div class="leftnav">
		<h3>退货商品管理</h3>
		<Form :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker :transfer="true" :value="dateArr" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="送达时间" :clearable="false" style="width: 200px" @on-change="changeDate"></DatePicker>
				<AutoComplete v-model="provides" icon="ios-search" placeholder="请输入供应商名称" style="width:200px">
				<div class="demo-auto-complete-item">
					<Option v-for="option in gysList" :value="option.supplier_name" :key="option.supplier_id">
						<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
					</Option>
				</div>
			</AutoComplete>
				<Input v-model="i_id" placeholder="请输入款式编码" clearable style="width: 200px" />
				<Input v-model="remark" placeholder="请输入备注" clearable style="width: 200px" />
				<Button type="info" @click="hangechange(1)">查询</Button>
			</FormItem>
		</Form>
		<div id="btnarr">
			<div class="left_button">
			</div>
			<Button class="setBut" type="success" @click="excel">导出Excel</Button>
		</div>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="supplier_name" label="档口号">
			</el-table-column>
			<el-table-column prop="sku_id" label="SKU">
			</el-table-column>
			<el-table-column prop="i_id" label="款式编码">
			</el-table-column>
			<el-table-column prop="package_id" label="包裹号">
			</el-table-column>
			<el-table-column prop="is_return" label="是否退回">
			</el-table-column>
			<el-table-column prop="operator" label="送达人">
			</el-table-column>
			<el-table-column prop="arrive_time" label="送达时间">
			</el-table-column>
			<el-table-column prop="remark" show-overflow-tooltip label="备注">
			</el-table-column>
		</el-table>
		<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	</div>
</template>

<script>
	import $axios from '@/axios/http.js';
	export default {
		name: 'return_goods',
		data() {
			return {
				dateArr:[],		//时间区间
				start_date:"",
				end_date:"",
				provides: '',
				i_id:"",
				remark:"",
				gysList:[],		//供应商列表
				tableData: [],	//列表数据
				total: 0,
				current: 1,
			}
		},
		created() {
			var day = new Date();
			day.setTime(day.getTime()-24*60*60*1000);
			var currentDate = new Date(day);
			var myyear = currentDate.getFullYear(); 
			var mymonth = currentDate.getMonth()+1; 
			var myweekday = currentDate.getDate(); 
			if(mymonth < 10){ 
				mymonth = "0" + mymonth; 
			} 
			if(myweekday < 10){ 
				myweekday = "0" + myweekday; 
			}
			this.dateArr[0] = myyear+"-"+mymonth + "-" + myweekday;
			this.dateArr[1] = myyear+"-"+mymonth + "-" + myweekday;
			this.start_date = myyear+"-"+mymonth + "-" + myweekday;
			this.end_date = myyear+"-"+mymonth + "-" + myweekday;
			//获取供应商列表
			this.getGysList();
			//获取列表
			this.getList();
		},
		methods: {
			//时间切换
			changeDate(e){
				this.start_date = e[0];
				this.end_date = e[1];
			},
			//获取供应商列表
			getGysList(){
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
					params: {}
				})
				.then(res => {
					this.gysList = res.data.data;
				});
			},
			//分页
			hangechange(val) {
				this.current = val;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				this.$axios.get('/admin/goods/goodslist', {
					params: {
						page:this.current,
						start_date:this.start_date,
						end_date:this.end_date,
						supplier:this.provides,
						i_id:this.i_id,
						remark:this.remark
					}
				})
				.then(res => {
					this.tableData = res.data.data.data;
					this.total = res.data.data.total;
				});
			},
			excel() {
				window.location.href = "/admin/goods/returngoodsexport?start_date=" + this.start_date + '&end_date=' + this.end_date + '&supplier=' + this.provides + '&i_id=' + this.i_id + '&remark=' + this.remark; 
			},

		},
		
	}
</script>
<style type="text/css">
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{-webkit-appearance: none;}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.leftnav {
	width: 100%;
	height: 100%;
}

#page {
	text-align: right;
	margin-top: 20px;
}

#btnarr {
	display:flex;
	align-items: center;
	justify-content: space-between;
}
.left_button{
	display:flex;
}
.setBut{
	margin-left: 5px;
}
.btnones {
	background: #2d8cf0;
	color: white;
}

#btnones {
	background: #2d8cf0;
	color: white;
}

.btnones:active {
	background: #2d8cf0;
	color: white;
}

.demo-auto-complete-item {
	height: 200px;
	overflow: auto;
}
.goods_row{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.num_icon{
	margin-left: 20px;
	font-size: 20px;
}
</style>
