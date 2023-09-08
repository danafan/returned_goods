<template>
	<div>
		<h3>后台拿货管理</h3>
		<Form inline>
			<FormItem>
				<DatePicker type="daterange" :options="date_option" placement="bottom-end" placeholder="选择日期" style="width: 300px" @on-change="changeDate"></DatePicker>
			</FormItem>
			<FormItem>
				<Input v-model="content" placeholder="供应商" style="width: 300px" />
			</FormItem>
			<FormItem>
				<Button type="info" @click="search">查询</Button>
				<Button type="success" @click="exportFile">导出</Button>
			</FormItem>
		</Form>
		<el-table :data="tableObj.data" border>
			<el-table-column label="图片">
				<template slot-scope="scope">
					<el-image 
					 style="width: 80px;height: 80px"
					:src="scope.row.image" 
					:preview-src-list="[scope.row.image]">
				</el-image>
			</template>
		</el-table-column>
		<el-table-column prop="supplier_name" label="供应商">
		</el-table-column>
		<el-table-column prop="num" label="数量">
		</el-table-column>
		<el-table-column prop="package_id" label="包裹号码" width="200">
		</el-table-column>
		<el-table-column prop="username" label="上传人">
		</el-table-column>
		<el-table-column prop="car_no" label="车牌号">
		</el-table-column>
		<el-table-column prop="time" label="时间" width="200">
		</el-table-column>
		<el-table-column label="操作">
			<template slot-scope="scope">
				<Button type="primary" @click="deleteItem(scope.row.id)">删除</Button>
			</template>
		</el-table-column>
	</el-table>
	<Page :total="tableObj.total" show-total @on-change="pageChange" :current="page"/>
	<Modal v-model="modal3">
		<img style="width: 100%" :src="big_img_url">
	</Modal>
</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		data() {
			return {
				date_option: {
					shortcuts: [
					{
						text: '近一周',
						value () {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							return [start, end];
						}
					},
					{
						text: '近一个月',
						value () {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							return [start, end];
						}
					},
					{
						text: '近三个月',
						value () {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							return [start, end];
						}
					}
					]
				},
                date_list:["",""],			//筛选日期
                content:"",					//输入的内容
                page:1,						//页码
                tableObj:{},
                total: 0,
                modal3:false,
                big_img_url:"",
            }
        },
        created() {
        	document.title = "拿货管理";
        	//获取列表
        	this.getList();
        },
        methods: {
        	bigImg(big_img_url){
        		this.modal3 = true;
        		this.big_img_url = big_img_url;
        	},
			//切换日期
        	changeDate(date){
        		this.date_list = date;
        	},
			//查询
        	search() {
        		this.page = 1;
        		this.getList();
        	},
			// 切换页码
        	pageChange(val) {
        		this.page = val;
        		this.getList();
        	},
			//导出
        	exportFile(){
        		this.$Modal.confirm({
        			title: '确认导出？',
        			onOk: () => {
        				let open_url = `${location.origin}/admin/takegoodslog/export?start_date=${this.date_list[0]}&end_date=${this.date_list[1]}&content=${this.content}`;
        				window.open(open_url);
        			},
        			onCancel: () => {
        				this.$Message.warning('取消');
        			}
        		});
        	},
			//获取列表
        	getList(){
        		let req = {
        			page:this.page,
        			start_date:this.date_list[0],
        			end_date:this.date_list[1],
        			content:this.content
        		}
        		this.$axios.get('admin/takegoodslog/list', {
        			params: req
        		}).then(res => {
        			this.tableObj = res.data.data;
        		});
        	},
			//删除
        	deleteItem(id){
        		this.$Modal.confirm({
        			title: '确认删除',
        			onOk: () => {
        				this.$axios.post('admin/takegoodslog/del', {id:id}).then(res => {
        					this.$Message.success('删除成功');
							//获取列表
        					this.getList();
        				});
        			},
        			onCancel: () => {
        				this.$Message.warning('取消');
        			}
        		});
        	}
        }
    }
</script>
<style scoped>

</style>
