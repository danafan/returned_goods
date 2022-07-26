<template>
	<div class="leftnav">
		<h3>退货管理</h3>
		<Form :model="formItem" :label-width="80" style="margin-top: 50px;text-align: left;" onsubmit="return false">
			<FormItem>
				<DatePicker :transfer="true" :value="dateArr" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择日期" :clearable="false" style="width: 200px" @on-change="changeDate"></DatePicker>
				<Input v-model="formItem.sku" placeholder="请输入SKU名称" clearable style="width: 200px" />
				<Input v-model="formItem.id" placeholder="请输入包裹ID" clearable style="width: 200px" />
				<AutoComplete v-model="formItem.provides" icon="ios-search" placeholder="请输入供应商名称" style="width:200px"
				@on-select="select_is">
				<div class="demo-auto-complete-item">
					<Option v-for="option in cityList" :value="option.supplier_name" :key="option.supplier_id">
						<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
					</Option>
				</div>
			</AutoComplete>
			<AutoComplete v-model="formItem.carnumber" icon="ios-search" placeholder="请输入车号" style="width:200px"
			@on-select="select_carnumber">
			<div class="demo-auto-complete-item">
				<Option v-for="option in cityList1" :value="option.plate_number" :key="option.id">
					<span class="demo-auto-complete-title">{{ option.plate_number }}</span>
				</Option>
			</div>
		</AutoComplete>
		<AutoComplete v-model="formItem.peoplename" icon="ios-search" placeholder="请输入姓名" style="width:200px"
		@on-select="select_peoplename">
		<div class="demo-auto-complete-item">
			<Option v-for="option in cityList2" :value="option.name" :key="option.userid">
				<span class="demo-auto-complete-title">{{ option.name }}</span>
			</Option>
		</div>
	</AutoComplete>
	<i-select style="width:200px" :model.sync="selSign" @on-change="signChange">
		<i-option v-for="item in signList" :key="item.value" :value="item.value">{{ item.text }}</i-option>
	</i-select>
	<Select v-model="is_draw_bill" style="width:200px">
		<Option v-for="item in drawBillList" :key="item.value" :value="item.value">{{ item.text }}</Option>
	</Select>
	<!-- 仓库选择 -->
	<Select v-model="wms_co_id" style="width:200px" placeholder="请选择仓库">
		<Option v-for="item in wmsList" :key="item.wms_co_id" :value="item.wms_co_id">{{ item.name }}</Option>
	</Select>
	<Input v-model="remark" placeholder="请输入备注" clearable style="width: 200px" />
	<Button type="info" @click="search">查询</Button>
</FormItem>
</Form>
<div id="btnarr">
	<div class="left_button">
		<ButtonGroup>
			<Button v-for="(item,index) in btnarr" :key="item.value" :class="{btnones:show1 == index}" @click="btnevent(index,item.value)">{{ item.text }}</Button>
		</ButtonGroup>
		<Button class="setBut" type="success" @click="excel">导出Excel</Button>
		<Button class="setBut" type="success" @click="excel1">档口号Excel</Button>
		<Button class="setBut" type="success" @click="shabi">导出送达</Button>
		<Button class="setBut" type="success" @click="signSel" v-if="isSelected">标记已选</Button>
	</div>
	
	<Button type="success" @click="setPackage">批量打包</Button>
</div>
<el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
	<el-table-column prop="supplier_name" label="供应商名称">
	</el-table-column>
	<el-table-column prop="wms_name" label="仓库">
	</el-table-column>
	<el-table-column prop="package_id" label="包裹ID">
	</el-table-column>
	<el-table-column prop="goods_num" label="退货总数量(件)">
	</el-table-column>
	<el-table-column prop="time" label="更新时间">
	</el-table-column>
	<el-table-column prop="status" label="状态">
	</el-table-column>
	<el-table-column prop="draw_bill" label="开单状态">
	</el-table-column>
	<el-table-column prop="remark" show-overflow-tooltip label="备注">
	</el-table-column>
	<el-table-column label="异常状态">
		<template slot-scope="scope">
			<el-button v-if="scope.row.exception_status == 1" type="text" @click="handleEdit(scope.$index, scope.row,2)">处理通知</el-button>
		</template>
	</el-table-column>
	<el-table-column label="签名" width="120">
		<template slot-scope="scope">
			<img class="routere" v-if="scope.row.sign_img != ''" style="width: 80px;height: 80px" :src="scope.row.sign_img" @click="bigImg(scope.row.sign_img)">
		</template>
	</el-table-column>
	<el-table-column width="550" label="操作">
		<template slot-scope="scope">
			<el-button type="primary" @click="handleEditss(scope.$index, scope.row)">查看包裹码</el-button>
			<el-button type="primary" v-if="scope.row.is_draw_bill == 0 && scope.row.status_id == 4" @click="tagDraw(scope.row.package_id)">标记已开单</el-button>
			<el-button type="primary" v-if="scope.row.status_id < 4 && scope.row.exception_status == 0" @click="biao(scope.row.package_id)">标记异常</el-button>
			<el-button type="success" v-if="scope.row.exception_status == 1">已标记</el-button>
			<el-button type="primary" @click="handleEdit(scope.$index, scope.row,1)">状态详情</el-button>
			<el-button type="primary" @click="goodslist(scope.$index, scope.row)">商品详情</el-button>
		</template>
	</el-table-column>
	<el-table-column
	v-if="isSelected"
	type="selection"
	width="80">
</el-table-column>
</el-table>
<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
<Modal v-model="modal1" title="商品包裹详情" :closable="false">
	<el-table :data="tableData1" border style="width: 100%" @selection-change="handleSelectionChanges">
		<el-table-column prop="sku_id" label="SKU">
		</el-table-column>
		<el-table-column prop="num" label="数量">
		</el-table-column>
	</el-table>
	<Page :total="total1" show-total id="page" @on-change="hangechanges" :current="current1" />
	<div v-show="statusmodel">
		<p>供应商确实核实已收到{{goods}}件商品</p>
		<p>系统计算商品总数量为{{totalnum}}</p>
		<p>情况备注:{{remarks}}</p>
	</div>
	<div slot="footer">
		<Button type="success" @click="excels()">导出excel</Button>
	</div>
</Modal>
<!-- 杂货打包弹窗 -->
<el-dialog title="批量打包" @close="closeDialog" width="40%" :close-on-click-modal="false" :visible.sync="packDialog">
	<div>
		<div class="goods_row" v-for="(item,index) in goodsList">
			<el-input size="small" style="width: 260px" placeholder="商品编码" v-model="item.sku_id"></el-input>
			<el-input size="small" type="number" style="margin-left: 15px;width: 160px" placeholder="商品数量" v-model="item.num">
				<template slot="append">件</template>
			</el-input>
			<i class="num_icon el-icon-remove" style="color: red" v-if="goodsList.length > 1" @click="reductGoods(index)"></i>
			<i class="num_icon el-icon-circle-plus" style="color: green" v-if="index == goodsList.length - 1" @click="addGoods"></i>
		</div>
		<div class="goods_row">
			供应商：
			<el-select size="small" v-model="select_gys_id" clearable :popper-append-to-body="false" filterable placeholder="选择供应商">
				<el-option v-for="item in gysList" :key="item.supplier_id" :label="item.supplier_name" :value="item.supplier_id">
				</el-option>
			</el-select>
		</div>
		<div class="goods_row">
			仓库：
			<el-select size="small" v-model="wms_id" clearable :popper-append-to-body="false" filterable placeholder="选择仓库">
				<el-option v-for="item in wmsList" :key="item.wms_co_id" :label="item.name" :value="item.wms_co_id">
				</el-option>
			</el-select>
		</div>
		<div class="goods_row">
			打印机：
			<el-select size="small" v-model="select_dyj_id" clearable :popper-append-to-body="false" filterable placeholder="选择打印机">
				<el-option v-for="item in dyjList" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</div>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button type="primary" size="small" @click="packDialog = false">取消</el-button>
		<el-button type="primary" size="small" @click="commitPackage">提交</el-button>
	</div>
</el-dialog>
<Modal title="包裹码" v-model="modal7" :closable="false">
	<p style="text-align: center;height: 250px;">
		<img :src="img" alt="" style="widows: 100px;height: 250px;">
	</p>
	<div slot="footer">
	</div>
</Modal>
<Modal v-model="modal3" width="80%">
	<div class="asd">
		<img class="routere" :src="big_img_url">
	</div>
	
</Modal>
</div>
</template>

<script>
	import $axios from '@/axios/http.js';
	import formatTime from '@/axios/utils.js';
	export default {
		name: 'leftnav',
		data() {
			return {
				modal7: false,
				img:"",
				packDialog:false,
				goodsList:[{
					sku_id:"",
					num:1
				}],
				gysList:[],
				select_gys_id:"",
				dyjList:[],
				select_dyj_id:"",
				modal1: false,
				tableData1: [],
				total1: 0,
				goods: '',
				totalnum: '',
				remarks: '暂无',
				formItem: {
					start_date:"",
					end_date:"",
					provides: '',
					sku: '',
					carnumber: '',
					peoplename: '',
					id: ''
				},
				dateArr:[],		//时间区间
				cityList: [],
				cityList1: [],
				cityList2: [],
				signList:[
				{
					value: 0,
					text: '全部'
				},
				{
					value: 1,
					text: '已标记'
				},
				{
					value: 2,
					text: '未标记'
				}
				],
				is_draw_bill:-1,		//开单状态
				remark:"",
				drawBillList:[
				{
					value: -1,
					text: '全部'
				},
				{
					value: 0,
					text: '未开单'
				},
				{
					value: 1,
					text: '已开单'
				}
				],					//开单状态
				selSign:0,			//选中的标记
				isSelected:false,	//默认最左侧多选框不展示
				multipleSelection:[],
				btnarr: [{
					value: 0,
					text: '全部'
				},
				{
					value: 1,
					text: '已打包'
				},
				{
					value: 2,
					text: '已装车'
				},
				{
					value: 3,
					text: '已下车'
				},
				{
					value: 4,
					text: '已送达'
				},
				{
					value: 5,
					text: '已确认'
				}
				],
				tableData: [],
				current: 1,
				total: 0,
				show1: false,
				type1: 0,
				btnvalue: '',
				list: [],
				vuecount: 0,
				list3: [],
				peoplename: '',
				params: {},
				supplier_id: '',
				list1: [],
				carnumber: '',
				ullist1: [],
				ullist2: [],
				ullist: [],
				current1: 1,
				id: '',
				statusmodel: false,
				modal3:false,
				big_img_url:"",
				wmsList:[],					//仓库列表
				wms_co_id:"",			//查询条件仓库
				wms_id:"",				//批量打包选中的仓库

			}
		},
		methods: {
			bigImg(big_img_url){
				this.modal3 = true;
				this.big_img_url = big_img_url;
			},
			handleEditss(index, row) {
				this.img = '';
				this.modal7 = true;
				this.$axios.get('/admin/supplier/qrcode', {
					params: {
						id: row.package_id,
					}
				})
				.then(res => {
						// console.log(res.data)
						this.img = res.request.responseURL;
					});

			},
			// 杂货打包
			setPackage(){
				this.packDialog = true;
				//获取供应商列表
				this.getGysList();
				//获取打印机列表
				this.getDyjList();
			},
			//删除商品
			reductGoods(i){
				this.goodsList.splice(i,1);
			},
			//添加商品
			addGoods(){
				this.goodsList.push({
					sku_id:"",
					num:1
				})
			},
			//关闭打包弹窗
			closeDialog(){
				this.goodsList = [{
					sku_id:"",
					num:1
				}];
				this.select_gys_id = "";
				this.select_dyj_id = "";
			},
			//获取仓库列表
			getWmsList(){
				this.$axios.get('/ajax_wms', {
					params: {}
				})
				.then(res => {
					this.wmsList = res.data.data;
				});
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
			//获取打印机列表
			getDyjList(){
				this.$axios.get('/api/package/printer_list', {
					params: {}
				})
				.then(res => {
					this.dyjList = res.data;
				});
			},
			//提交
			commitPackage(){
				var haveNull = false;
				for (var i = 0; i < this.goodsList.length;i++) {
					if(this.goodsList[i].sku_id == "" || this.goodsList[i].num == ""){
						this.$message.warning('有未完善的商品'); 
						haveNull = true;
						return;
					}
				}
				if(this.select_gys_id == ''){
					this.$message.warning('请选择供应商'); 
					return;
				}
				if(this.wms_id == ''){
					this.$message.warning('请选择仓库'); 
					return;
				}
				if(this.select_dyj_id == ''){
					this.$message.warning('请选择打印机'); 
					return;
				}
				let arg = {
					data:JSON.stringify(this.goodsList),
					supplier_id:this.select_gys_id,
					printer:this.select_dyj_id,
					wms_id:this.wms_id
				}
				this.$axios.post('admin/package/pack', arg).then(res => {
					if (res.data.code == 1) {
						this.$Message.success(res.data.msg);
						this.packDialog = false;
						//表格渲染
						this.userlist();
					} else {
						this.$Message.error(res.data.msg);
					}
				});
			},
			signChange(e){
				this.selSign = e;
			},
			changeDate(e){
				this.formItem.start_date = e[0];
				this.formItem.end_date = e[1];
			},
			excels() {
				window.location.href = "/admin/goods/showdetailexport?id=" + this.id;
			},
			handleSelectionChanges() {},
			hangechanges(val) {
				this.current1 = val;
				this.listchange();
			},
			goodslist(index, row) {
				this.modal1 = true;
				this.id = row.package_id;
				this.tableData1 = [];
				this.total1 = 0;
				this.statusmodel = false;
				this.goods = this.totalnum = this.remarks = '';
				this.listchange();
			},
			listchange() {
				this.$axios.get('admin/goods/showdetaillist', {
					params: {
						pagesize: 10,
						page: this.current1,
						id: this.id
					}
				})
				.then(res => {
					if (res.data.code == 10000) {
						this.$Message.error(res.data.msg);
						this.$router.push({
							path: '/login'
						})
					} else {
						this.tableData1 = res.data.data.list.data;
						this.total1 = res.data.data.list.total;
						this.goods = res.data.data.info.import;
						this.totalnum = res.data.data.info.totalnum;
						this.remarks = res.data.data.info.remark;
						if (res.data.data.info.status === 5) {
							this.statusmodel = true;
						}
					}
				});
			},
			//多加的按钮
			shabi(){
				window.location.href = "/admin/goods/arriveexport?start_date=" + this.formItem.start_date + '&end_date=' + this.formItem.end_date + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
			},
			//请输入供应商名称
			providename(value) {
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
				if (list.length != 0) {
					this.supplier_id = list[0].supplier_id;
				}
				this.type1 = 1;
				this.params = {
					pagesize: 10,
					page: this.current,
					supplier: this.supplier_id,
					type: this.type1, //正常搜索
				}
				this.commonTable();
				if (!value) {
					this.userlist();
					this.type1 = 0;
					this.current = 1;
				}
			},
			select_is() {
				this.vuecount = 1;
			},
			//请输入车号
			carnumbername(value) {
				this.list1 = [];
				this.ullist1.map((v, index) => {
					let val = v.plate_number.indexOf(value);
					if (val != -1) {
						let list = {
							id: v.id,
							plate_number: v.plate_number
						};
						this.list1.push(list);
					}
				});
				this.cityList1 = this.list1;
				let list = this.cityList1.filter((v) => v.plate_number == value);
				if (list.length != 0) {
					this.carnumber = list[0].id;
				}
				this.type1 = 1;

				this.params = {
					pagesize: 10,
					page: this.current,
					car: this.carnumber,
					type: this.type1, //正常搜索
				}
				this.commonTable();
				if (!value) {
					this.userlist();
					this.type1 = 0;
					this.current = 1;
				}
			},
			select_carnumber() {
				this.vuecount = 1;
			},
			//请输入姓名
			peoplename_id(value) {
				this.list3 = [];
				this.ullist2.map((v, index) => {
					let val = v.name.indexOf(value);
					if (val != -1) {
						let list = {
							userid: v.userid,
							name: v.name
						};
						this.list3.push(list);
					}
				});
				this.cityList2 = this.list3;
				let list = this.cityList2.filter((v) => v.name == value);
				if (list.length != 0) {
					this.peoplename = list[0].userid;
				}
				this.type1 = 1;

				this.params = {
					pagesize: 10,
					page: this.current,
					username: this.peoplename,
					type: this.type1, //正常搜索
				}
				this.commonTable();
				if (!value) {
					this.userlist();
					this.type1 = 0;
					this.current = 1;

				}
			},
			select_peoplename() {
				this.vuecount = 1;
			},
			search() {
				this.current = 1;
				this.type1 = 0;
				this.userlist();
			},
			allsearch() {
				this.$axios.get('admin/goods/ajaxcarlist', {
					params: {}
				})
				.then(res => {
					this.cityList1 = res.data.data;
					this.ullist1 = res.data.data;
				});
				this.$axios.get('admin/goods/ajaxuserlist', {
					params: {}
				})
				.then(res => {
					this.cityList2 = res.data.data;
					this.ullist2 = res.data.data;
				});
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
					params: {}
				})
				.then(res => {
					this.cityList = res.data.data;
					this.ullist = res.data.data;
				});

			},
			excel() {
				if (this.type1 === 1) {
					if (this.supplier_id) {
						window.location.href = "/admin/goods/goodsexport?supplier=" + this.supplier_id + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					} else if (this.formItem.sku) {
						window.location.href = "/admin/goods/goodsexport?sku=" + this.formItem.sku + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					} else if (this.formItem.id) {
						window.location.href = "/admin/goods/goodsexport?package_id=" + this.formItem.id + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					} else if (this.carnumber) {
						window.location.href = "/admin/goods/goodsexport?car=" + this.carnumber + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					} else if (this.peoplename) {
						window.location.href = "/admin/goods/goodsexport?username=" + this.peoplename + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					} else {
						window.location.href = "/admin/goods/goodsexport?type=" + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
					}
				} else {
					window.location.href = "/admin/goods/goodsexport?start_date=" + this.formItem.start_date + '&end_date=' + this.formItem
					.end_date + '&supplier=' + this.formItem.provides + '&sku=' + this.formItem.sku + '&car=' + this.formItem.carnumber +
					'&username=' + this.formItem.peoplename +
					'&package_id=' + this.formItem.id + '&status=' + this.btnvalue + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark + '&wms_co_id=' + this.wms_co_id;
				}
			},
			excel1() {
				if (this.type1 === 1) {
					if (this.supplier_id) {
						window.location.href = "/admin/goods/exportbysupplier?supplier=" + this.supplier_id + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					} else if (this.formItem.sku) {
						window.location.href = "/admin/goods/exportbysupplier?sku=" + this.formItem.sku + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					} else if (this.formItem.id) {
						window.location.href = "/admin/goods/exportbysupplier?package_id=" + this.formItem.id + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					} else if (this.carnumber) {
						window.location.href = "/admin/goods/exportbysupplier?car=" + this.carnumber + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					} else if (this.peoplename) {
						window.location.href = "/admin/goods/exportbysupplier?username=" + this.peoplename + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					} else {
						window.location.href = "/admin/goods/exportbysupplier?type=" + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
					}
				} else {
					window.location.href = "/admin/goods/exportbysupplier?start_date=" + this.formItem.start_date + '&end_date=' + this.formItem
					.end_date + '&supplier=' + this.formItem.provides + '&sku=' + this.formItem.sku + '&car=' + this.formItem.carnumber +
					'&username=' + this.formItem.peoplename +
					'&package_id=' + this.formItem.id + '&status=' + this.btnvalue + '&type=' + this.type1 + '&is_draw_bill=' + this.is_draw_bill + '&remark=' + this.remark;
				}
			},
			//多选
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			//点击标记已选
			signSel(){
				if(this.multipleSelection.length > 0){
					this.$confirm('确认将选中项标记为异常?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//标记异常接口
						let ids = [];
						this.multipleSelection.map(item =>{
							ids.push(item.package_id);
						})
						this.$axios.get('admin/goods/signAll', {
							params: {
								package_id:ids.join(',')
							},
						}).then(res => {
							if (res.data.code == 1) {
								this.$Message.success(res.data.msg);
								//表格渲染
								this.userlist();
							} else {
								this.$Message.error(res.data.msg);
							}
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消标记'
						});          
					});
				}else{
					this.$Message.error("您还没有选中项");
				}
			},
			//标记已开单
			tagDraw(id){
				this.$confirm('确认将该包裹标记已开单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.post('admin/goods/drawbill', {
						package_id:id
					}).then(res => {
						if (res.data.code == 1) {
							this.$Message.success(res.data.msg);
							this.userlist();
						} else {
							this.$Message.error(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消标记'
					});          
				});
			},
			//点击标记异常
			biao(id){
				this.$confirm('确认将该包裹标记为异常?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//标记异常接口
					this.sign(id);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消标记'
					});          
				});
			},
			//标记异常接口
			sign(id){
				this.$axios.get('admin/goods/sign', {
					params: {
						package_id:id
					},
				}).then(res => {
					if (res.data.code == 1) {
						this.$Message.success(res.data.msg);
						//表格渲染
						this.userlist();
					} else {
						this.$Message.error(res.data.msg);
					}
				});
			},
			btnevent(index, value) {
				this.show1 = index;
				this.btnvalue = value;
				this.type1 = 0;
				this.current = 1;
				this.userlist();
			},
			//查看详情
			handleEdit(index, row,type) {
				sessionStorage.setItem('id', row.package_id)
				sessionStorage.setItem('status',row.exception_status);
				sessionStorage.setItem('type',type);
				this.$router.push({
					path: '/goodsone'
				})
			},
			//分页
			hangechange(val) {
				this.current = val;
				console.log(this.params)
				this.params.page = val;
				console.log(this.type1)
				if (this.type1 === 0) {
					this.userlist()
				}
				if (this.type1 === 1) {
					this.commonTable();
				}
			},
			//table单个搜索渲染列表
			commonTable() {
				var params = this.params;
				if (this.vuecount === 1 || this.type1 === 1) {
					this.$axios.get('admin/goods/packagelist', {
						params
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							});
							this.vuecount = 0;
						} else {
							this.tableData = res.data.data.data;
							this.total = res.data.data.total;
							this.vuecount = 0;
						}
					});
				}
			},
			//表格渲染
			userlist() {
				this.$axios.get('admin/goods/packagelist', {
					params: {
						pagesize: 10,
						page: this.current,
						start_date: this.formItem.start_date,
						end_date: this.formItem.end_date,
						sku: this.formItem.sku,
						package_id: this.formItem.id,
						car: this.formItem.carnumber,
						username: this.formItem.peoplename,
						supplier: this.formItem.provides,
						type: this.type1, //正常搜索
						status: this.show1 == 6?0:this.btnvalue,
						exception_status:this.selSign,
						is_draw_bill:this.is_draw_bill,
						remark:this.remark,
						wms_co_id:this.wms_co_id
					},

				})
				.then(res => {
					if (res.data.code == 10000) {
						this.$Message.error(res.data.msg);
						this.$router.push({
							path: '/login'
						})
					} else {
						if(this.selSign == 2){
							this.isSelected = true;
						}else{
							this.isSelected = false;
						}
						this.tableData = res.data.data.data;
						this.total = res.data.data.total;
					}
				});
			},

		},
		created() {
			document.title = '退货管理';
			var now = new Date(); 
			var myyear = now.getFullYear(); 
			var mymonth = now.getMonth()+1; 
			var myweekday = now.getDate(); 
			if(mymonth < 10){ 
				mymonth = "0" + mymonth; 
			} 
			if(myweekday < 10){ 
				myweekday = "0" + myweekday; 
			}
			this.dateArr[0] = myyear+"-"+mymonth + "-" + myweekday;
			this.dateArr[1] = myyear+"-"+mymonth + "-" + myweekday;
			this.formItem.start_date = myyear+"-"+mymonth + "-" + myweekday;
			this.formItem.end_date = myyear+"-"+mymonth + "-" + myweekday;
			this.allsearch();
			this.userlist();
			//获取仓库列表
			this.getWmsList();
		}
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
.asd{
	display:flex;
	align-items: center;
	justify-content: center;
}
.routere{
	transform: rotate(-90deg);
}
</style>
