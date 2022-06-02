<template>
	<div class="userprovide" @click="parent($event)">
		<h3>供应商管理</h3>
		<div class="haha">
			<Form ref="formInline" :model="formInline" inline style="text-align: left;margin-top: 20px;" onsubmit="return false">
				<FormItem prop="user">
					<AutoComplete v-model="value3" icon="ios-search" placeholder="请输入供应商名称" style="width:250px" @on-change="onchange"
					autocomlete="on">
					<div class="demo-auto-complete-item">
						<Option v-for="option in cityList" :value="option.supplier_name" :key="option.supplier_id">
							<span class="demo-auto-complete-title">{{ option.supplier_name }}</span>
						</Option>
					</div>
				</AutoComplete>
			</FormItem>
		</Form>
		<Button :size="buttonSize" icon="ios-download-outline" type="primary" @click="down">导出表格</Button>
	</div>
	<el-table :data="tableData" border style="width: 100%;">
		<el-table-column prop="supplier_id" label="序号">
		</el-table-column>
		<el-table-column prop="supplier_name" label="供应商名称">
		</el-table-column>
		<el-table-column prop="nickname" label="微信昵称">
		</el-table-column>
		<el-table-column prop="phone" label="手机号">
		</el-table-column>
		<el-table-column prop="modified" label="增加供应商时间">
		</el-table-column>
		<el-table-column prop="address" label="操作">
			<template slot-scope="scope">
				<el-button @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
				<el-button type="primary" icon="el-icon-edit" circle @click="open3(scope.row)"></el-button>
			</template>
		</el-table-column>
	</el-table>
	<Page :total="total" show-total id="page" @on-change="hangechange" :current="current" />
	<Modal title="查看二维码" v-model="modal7" :closable="false" @on-ok="sure" @on-cancel="cancel">
		<p style="text-align: center;height: 250px;">
			<img :src="img" alt="" style="widows: 100px;height: 250px;">
		</p>
		<div slot="footer">
		</div>
	</Modal>

</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'userprovide',
		data() {
			return {
				buttonSize: 'large',
				modal7: false,
				total: 0,
				formInline: {
					select: ''
				},
				cityList: [],
				tableData: [],
				pageIndex: 1,
				img: '',
				current: 1,
				sel: false,
				select_id: '',
				list: [],
				ullist: [],
				value3: '',
				type:0
			}
		},
		created() {
			document.title = "供应商管理";
			this.input();
			this.userlist();
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
					this.type = 1;
					this.current = 1;
					this.userlist();
				}
				if (!value) {
					this.type = 0;
					this.current = 1;
					this.select_id = ''
					this.userlist();
				}
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
					let val = v.supplier_name.indexOf(this.formInline.select);
					if (val != -1) {
						let list = {
							supplier_id: v.supplier_id,
							supplier_name: v.supplier_name
						};
						this.list.push(list);
					}
				});
				this.cityList = this.list;
				if (!this.formInline.select) {
					this.current = 1;
					this.select_id = '';
					this.type = 0;
					this.userlist();
				}
			},

			li_select(index, value) {
				let list = this.cityList.filter((v) => v.supplier_id == value);
				this.formInline.select = list[0].supplier_name;
				this.select_id = list[0].supplier_id
				this.current = 1;
				this.type = 1;
				this.userlist();
				this.sel = true;
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
			input() {
				this.$axios.get('/admin/supplier/ajaxsupplierlist', {
					params: {}
				})
				.then(res => {
					this.cityList = res.data.data;
					this.ullist = res.data.data;

				});
			},
			show() {
				this.current = 1;
				this.userlist();
			},
			handleEdit(index, row) {
				this.img = '';
				this.modal7 = true;
				this.sel = false;
				this.$axios.get('/admin/supplier/show', {
					params: {
						id: row.supplier_id,
					}
				})
				.then(res => {
						// console.log(res.data)
						this.img = res.request.responseURL;
					});

			},
			sure() {

			},
			cancel() {

			},
			hangechange(value) {
				this.current = value;
				this.userlist();
				this.sel = false;
			},
			userlist() {
				this.$axios.get('/admin/supplier/list', {
					params: {
						supplier_id: this.select_id,
						page: this.current,
						pagesize: 10,
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

				});

			},
			//导出表格
			down(){
				if(this.select_id == ""){
					window.location.href = "/admin/supplier/supplierexport"
				}else{
					if(typeof(this.select_id) == 'number'){
						var type = 1;
					}else{
						var type = 2;
					}
					window.location.href = "/admin/supplier/supplierexport?supplier_id=" + this.select_id + "&type=" + type
				}
			},
			//修改手机号
			open3(val) {
				let id = val.supplier_id;
				this.$prompt('修改手机号', '编辑', {
					inputValue:val.phone,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^1[3456789]\d{9}$/,
					inputErrorMessage: '手机号格式不正确'
				}).then(({ value }) => {
					this.$axios.post('/admin/supplier/editphone', {
						supplier_id:val.supplier_id,
						phone:value
					}).then(res => {
						if(res.data.code == 1){
							this.$message({
								type: 'info',
								message: '修改成功'
							}); 
							this.userlist();
						}else{
							this.$message({
								type: 'info',
								message: res.data.msg
							}); 
						}
						
					});
				})
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

.userprovide {
	width: 100%;
	height: 100%;
	cursor: pointer;
	z-index: 999;
}
.haha{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.div_class {
	position: absolute;
	will-change: top, left;
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
