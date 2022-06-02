<template>
	<div class="print">
		<div  ref="print">
			<Button type="success" @click="dayin">打印</Button>
			<Button type="error" @click="goback">返回</Button>
			
			<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
				<tr>
					<td align="center" class="biaoti" height="60">胖胖哥&文艺男女&8090服饰退货清单</td>
					
				</tr>
				
			</table>
			<div style="display: flex;" id="printTest">
				<table width="100%" border="0" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
					<tr>
						<td colspan="2" class="btbg font-center titfont" rowspan="2">档口号</td>
						<td width="10%" class="btbg font-center titfont" rowspan="2"></td>
						<td colspan="2" class="btbg font-center titfont">日期</td>
						<td colspan="2" class="btbg font-center titfont"></td>
						<td colspan="2" class="btbg font-center titfont">总数量</td>
						<td colspan="2" class="btbg font-center titfont"></td>
					</tr>
					<tr>
						<td colspan="2" class="btbg font-center titfont">清点人</td>
						<td colspan="2" class="btbg font-center titfont"></td>
						<td colspan="2" class="btbg font-center titfont">总包数</td>
						<td colspan="2" class="btbg font-center titfont"></td>

					</tr>
					<tr>
						<td colspan="2" class="btbg font-center titfont">货号</td>
						<td class="btbg font-center titfont">退货数量</td>
						<td colspan="2" class="btbg font-center titfont">备注</td>
						<td colspan="2" class="btbg font-center titfont">货号</td>
						<td colspan="2" class="btbg font-center titfont">退货数量</td>
						<td colspan="2" class="btbg font-center titfont">备注</td>
					</tr>
					
					<tr style="text-align: center;" v-for="(item,index) in tableData5" >
						<td colspan="2">{{item.id}}</td>
						<td>{{item.name}}</td>
						<td colspan="2"></td>
						<td colspan="2">{{item.name}}</td>
						<td colspan="2">{{item.name}}</td>
						<td colspan="2"></td>
					</tr>
					<tr>
						<td colspan="3" class="btbg font-center titfont">采购员：</td>
						<td colspan="2" class="btbg font-center titfont"></td>
						<td colspan="3" class="btbg font-center titfont">确认退货数量：</td>
						<td colspan="2" class="btbg font-center titfont"></td>
					</tr>
					<tr>
						<td colspan="3" class="btbg font-center titfont">档口确认人：</td>
						<td colspan="2" class="btbg font-center titfont"></td>
						<td colspan="3" class="btbg font-center titfont">档口确认日期：</td>
						<td colspan="2" class="btbg font-center titfont"></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'print',
		data() {
			return {
				tableData5: [],
				print:'',
				datetime:'',
				datetime1:''
			}
		},
		methods: {
			goback() {
				window.history.go(-1);
			},
			dayin() {
				var newstr = document.getElementById('printTest').innerHTML
				document.body.innerHTML = newstr
				window.print()
				// 重新加载页面，以刷新数据
				window.location.reload()
			},
			userlist(){
				this.$axios.get('admin/return/returnprint', {
						params: {
							start_date: this.datetime,
							end_date: this.datetime1,
							supplier: this.print 
						}
					})
					.then(res => {
						if (res.data.code == 10000) {
							this.$Message.error(res.data.msg);
							this.$router.push({
								path: '/login'
							})
						}
						
						console.log(res)
					})
			},
		},
		mounted() {

		},
		created() {
			document.title = "退货商品打印";
			this.print = sessionStorage.getItem('toarr');
			if(!sessionStorage.getItem('datetime')){
				this.datetime = '';
			}else{
				this.datetime = sessionStorage.getItem('datetime');
			}
			if(!sessionStorage.getItem('datetime1')){
				this.datetime1 = '';
			}else{
				this.datetime1 = sessionStorage.getItem('datetime1');
			}
			this.userlist();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.tabtop13 {
		margin-top: 13px;
	}

	.tabtop13 td {
		background-color: #ffffff;
		height: 25px;
		line-height: 150%;
	}

	.font-center {
		text-align: center
	}

	.btbg {
		background: #e9faff !important;
	}

	.btbg1 {
		background: #f2fbfe !important;
	}

	.btbg2 {
		background: #f3f3f3 !important;
	}

	.biaoti {
		font-family: 微软雅黑;
		font-size: 26px;
		font-weight: bold;
		border-bottom: 1px dashed #CCCCCC;
		color: #255e95;
	}

	.titfont {

		font-family: 微软雅黑;
		font-size: 16px;
		font-weight: bold;
		color: #255e95;
		background-color: #e9faff;
	}

	.tabtxt2 {
		font-family: 微软雅黑;
		font-size: 14px;
		font-weight: bold;
		text-align: right;
		padding-right: 10px;
		color: #327cd1;
	}

	.tabtxt3 {
		font-family: 微软雅黑;
		font-size: 14px;
		padding-left: 15px;
		color: #000;
		margin-top: 10px;
		margin-bottom: 10px;
		line-height: 20px;
	}

	.one {
		font-family: 微软雅黑;
		font-size: 16px;
		font-weight: bold;
		color: #255e95;
		text-align: center;
		padding: 10px;
		/* border: 1px solid #CCCCCC; */
		border-bottom: none;

	}
	#printTest{
		width: 100%;
		margin: auto;
	}
</style>
