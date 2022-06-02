<template>
	<div class="HelloWorld">
		<header>
			<div class="left">
				<Icon type="ios-barcode-outline" /><span>数据统计</span>
				<ButtonGroup>
					<Button v-for="(item,index) in btnarr" :key="item.value" @click="today(index,item.value)" :class="{btnones:show1 == index}">{{item.text}}</Button>
				</ButtonGroup>
				<el-table :data="tableData" style="width: 100%;margin-top: 50px;" border @cell-click="cellclick">
					<el-table-column prop="goods_num" label="退货量(件)">
					</el-table-column>
					<el-table-column prop="supplier_num" label="供应商退货数量(个)">
					</el-table-column>
					<el-table-column prop="package_num" label="退货包裹数量(个)">
					</el-table-column>
					<el-table-column width="120px" label="操作">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="right">
				<div>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>最新公告</span>
						</div>
						<div v-for="o in 1" :key="o" class="text item">

							暂无数据
						</div>

					</el-card>
				</div>
				<div class="nowlist">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>近期动态</span>
						</div>
						<div class="text item" style="margin-bottom:10px;overflow-y:auto;overflow: hidden;height: 100px;">
							<ul v-for="item in itemarr" :key="item.id">
								<li style="margin-bottom:10px;">
									<p style="text-align: left;">
										<Icon type="ios-basket" /><span style="margin-right: 10px;">{{ item.operate_sn }}</span><span>{{ item.operator }}</span></p>
									<p style="text-align: left;"><span>{{ item.operate_time }}</span><span>包裹编号:{{ item.package_id }}</span></p>
								</li>
							</ul>

						</div>
						<div class="more">
							<span @click="searchmore">查看更多>>></span>
						</div>

					</el-card>
				</div>
			</div>
		</header>
		<section>
			<Form ref="formInline" :model="formInline" inline style="text-align: center;">
				<FormItem prop="user">
					<Select v-model="formInline.select" style="width:200px" @on-change="selects">
						<Option v-for="item in cityList" :value="item.value" :key="item.label">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<ButtonGroup>
						<Button v-for="(item,index) in weekmonth" :key="item.value" @click="seven(index,item.value)" :class="{btnones:show4 == index}">{{item.text}}</Button>
					</ButtonGroup>

				</FormItem>
			</Form>
			<div id="myChart" :style="{width: '100%', height: '300px',margin:'auto'}">
			</div>
		</section>

	</div>
</template>
<script>
	export default {
		name: 'HelloWorld',
		data() {
			return {
				btnarr: [{
						value: 1,
						text: '今日'
					},
					{
						value: 2,
						text: '本周'
					},
					{
						value: 3,
						text: '本月'
					}
				],
				weekmonth: [{
						value: 1,
						text: '七天'
					},
					{
						value: 2,
						text: '一个月'
					},
					{
						value: 3,
						text: '三个月'
					}
				],
				sevens: '',
				formInline: {
					select: '' //
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
				xAxisarr: [],
				seriesdata: [],
				itemarr: [],
				show1: 0,
				show4: 0,
				textlist: '退货数据'
			}
		},
		methods: {
			today(index, value) {
				this.show1 = index;
				this.$axios.get('admin/index/getstatisbytime', {
						params: {
							type: value
						}
					})
					.then(res => {
						let supplier_num = {
							goods_num: res.data.data.goods_num,
							package_num: res.data.data.package_num,
							supplier_num: res.data.data.supplier_num
						};
						if (this.tableData.length != 0) {
							this.tableData = [];
						};
						this.tableData.push(supplier_num);
					});
			},
			info() {

			},
			selects() {
				if (!this.sevens) {
					this.sevens = 1;
				};
				this.$axios.get('admin/index/gettabledata', {
						params: {
							sort_type: this.formInline.select,
							date_type: this.sevens
						}
					})
					.then(res => {
						let xAxisarr, seriesdata;
						if (res.data.data.length == 0) {
							this.$Message.error('数据为空');
							xAxisarr = [0];
							seriesdata = [0];
							this.myChart(xAxisarr, seriesdata);
						} else {
							xAxisarr = res.data.data.day;
							seriesdata = res.data.data.num;
							// 基于准备好的dom，初始化echarts实例
							this.myChart(xAxisarr, seriesdata);
						};
					});
			},
			seven(index, value) {
				this.show4 = index;
				this.sevens = value;
				this.$axios.get('admin/index/gettabledata', {
						params: {
							sort_type: this.formInline.select,
							date_type: value
						}
					})
					.then(res => {
						let xAxisarr, seriesdata;
						if (res.data.data.length == 0) {
							this.$Message.error('数据为空');
							xAxisarr = [0];
							seriesdata = [0];
							this.myChart(xAxisarr, seriesdata);
						} else {
							xAxisarr = res.data.data.day;
							seriesdata = res.data.data.num;
							// 基于准备好的dom，初始化echarts实例
							this.myChart(xAxisarr, seriesdata);
						};
					});
			},
			myChart(xAxisarr, seriesdata) {
				let myChart = this.$echarts.init(document.getElementById('myChart'))
				// 绘制图表
				myChart.setOption({
					title: {
						text: this.textlist
					},
					tooltip: {},
					xAxis: {
						type: 'category',
						data: xAxisarr
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						name: '数量',
						data: seriesdata,
						type: 'line'
					}]
				});
			},
			searchmore() {
				this.$router.push({
					path: `pageack`
				})
			},
			cellclick(row, column, cell, event) {
				// console.log(row, column, cell, event);

			},
			handleEdit() {
				this.$router.push({
					path: `totle`
				})
			},
			alluser() {
				this.$axios.get('admin/index/index', {
						params: {

						}
					})
					.then(res => {
						let supplier_num = {
							goods_num: res.data.data.statistics.goods_num,
							package_num: res.data.data.statistics.package_num,
							supplier_num: res.data.data.statistics.supplier_num
						}
						this.tableData.push(supplier_num);
						let xAxisarr = res.data.data.table.day;
						let seriesdata = res.data.data.table.num;
						if (res.data.data.table.length === 0) {
							xAxisarr = [10];
							seriesdata = [0];
							this.textlist = '退货数据暂无';
						} else {
							this.textlist = '退货数据';
						}
						this.myChart(xAxisarr, seriesdata);
						this.itemarr = res.data.data.package.data
					});
			}


		},
		created() {
			this.formInline.select = this.cityList[0].value;
			this.alluser();

		},
		mounted() {
			// this.drawLine();
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.HelloWorld {
		width: 100%;
		height: 100%;
	}

	header {
		width: 100%;
		height: auto;
	}

	.left {
		width: 50%;
		height: auto;
		font-size: 24px;
		float: left;
		text-align: left;
	}

	.right {
		width: 50%;
		height: auto;
		float: left;
		padding: 50px;
	}

	#myChart {
		clear: both;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.clearfix {
		text-align: left;
	}

	.box-card {
		width: 480px;
	}

	.nowlist {
		margin-top: 15px
	}

	.more {
		border-top: 1px solid #CCCCCC;
		text-align: right;
		cursor: pointer;
		font-size: 14px;
	}

	.more>span:hover {
		color: red;
		cursor: pointer;
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
</style>
