<template>
	<div>
		<h3>标记记录</h3>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期区间:">
				<el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="处理状态">
				<el-select v-model="status" clearable placeholder="请选择">
					<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in status_list"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="包裹号">
				<el-input style="width: 200px" v-model="package_id" clearable placeholder="包裹号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div style="display: flex;justify-content: flex-end;margin-bottom: 15px;">
			<el-button type="primary" plain size="small" @click="excel">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="add_time" label="标记时间" align="center"></el-table-column>
			<el-table-column prop="package_id" label="包裹编号" align="center"></el-table-column>
			<el-table-column prop="operator_name" label="标记人" align="center"></el-table-column>
			<el-table-column prop="sign_handle_time" label="处理时间" align="center">
			</el-table-column>
			<el-table-column label="处理状态" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.sign_handle_status == '0'?'未处理':'已处理'}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="handler_name" label="处理人" align="center">
			</el-table-column>
			<el-table-column prop="remark" label="备注" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" v-if="scope.row.sign_handle_status == '0'" @click="checkFn(scope.row.package_id)">处理</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="buts">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 详情弹框 -->
		<el-dialog title="标记处理" width="300px" @close="remark = ''" :visible.sync="detailDialog">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="备注:">
					<el-input
					type="textarea"
					:rows="3"
					placeholder="请输入内容"
					v-model="remark">
				</el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="detailDialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="confirmRemark">确认</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<script>
	export default{
		data(){
			return{
				status_list:[{
					id:'1',
					name:'已处理'
				},{
					id:'0',
					name:'未处理'
				}],
				status:"",
				package_id:"",
				page:1,
				pagesize:10,
				date:[],
				table_data:[],
				total:0,
				detailDialog:false,
				remark:"",
				id:""
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			excel() {
				let params = {
					page: this.page,
					pagesize: this.pagesize,
					start_date: this.date && this.date.length> 0?this.date[0]:"",
					end_date: this.date && this.date.length> 0?this.date[1]:"",
					package_id: this.package_id
				}
				if(this.status != ''){
					params['status'] = this.status;
				}
				let arr = [];
				for(let k in params){
					let str = `${k}=${params[k]}`;
					arr.push(str)
				}
				window.location.href = `/admin/exception/sign_export?${arr.join('&')}`

			},
			//获取列表
			getData(){
				let params = {
					page: this.page,
					pagesize: this.pagesize,
					start_date: this.date && this.date.length> 0?this.date[0]:"",
					end_date: this.date && this.date.length> 0?this.date[1]:"",
					package_id: this.package_id
				}
				if(this.status != ''){
					params['status'] = this.status;
				}
				this.$axios.get('admin/exception/sign_list', {
					params: params
				})
				.then(res => {
					if (res.data.code == 1) {
						let data = res.data.data;
						this.table_data = data.data;
						this.total = data.total;
					}else{
						this.$Message.error(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			checkFn(id){
				this.id = id;
				this.detailDialog = true;
			},
			confirmRemark(){
				this.$axios.post('admin/exception/sign_handler', {
					package_id: this.id,
					remark:this.remark
				})
				.then(res => {
					if (res.data.code == 1) {
						this.$Message.success(res.data.msg);
						this.detailDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$Message.error(res.data.msg);
					}
				})
			}
		}
	}
</script>










