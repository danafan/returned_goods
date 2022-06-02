<template>
	<div class="goodsone">
		<h3>包裹状态详情</h3>
		<div class="btnleft">
			<Button type="error" @click="goback">返回</Button>
		</div>

		<ul class="container">
			<li v-if="this.status === 1">
				<Icon type="ios-cart" />
				<p>打包</p>
			</li>
			<li v-if="this.status === 2">
				<Icon type="md-car" />
				<p>装车</p>
			</li>
			<li v-if="this.status === 3">
				<Icon type="md-car" />
				<p>下车</p>
			</li>
			<li v-if="this.status === 4">
				<Icon type="md-checkmark-circle-outline" />
				<p>送达</p>
			</li>
			<li v-if="this.status === 5">
				<Icon type="md-checkmark-circle-outline" />
				<p>已确认</p>
			</li>
		</ul>
		<ul class="list">
			<li>包裹号码：{{ baoguonumber }}</li>
			<li>件数：{{ jianshu }}件</li>
			<li>供应商：{{dangkou }}</li>
		</ul>
		<div class="contain">
			<h2>{{ status | status}}</h2>

			<img :src="arrive_img" alt="无图片信息" style="width: 100px;height: 100px;" v-if="arrive_img !==''" v-image-preview>
			<div class="line">
				<ul>
					<li v-for="item in listarr" :key="item.id">
						<span class="point">
							<Icon type="ios-stopwatch" />
						</span>
						<span v-if="exception_status == 0 || (exception_status == 1 && type == 1)">{{item.operator}}：</span>
						<span v-if="exception_status == 0 || (exception_status == 1 && type == 1)">{{item.operate_sn}}</span><br>
						<span v-if="exception_status == 0 || (exception_status == 1 && type == 1)" style="margin-right: 8px;">{{item.plate_number}}</span>
						<span v-if="exception_status == 0 || (exception_status == 1 && type == 1)">{{item.operate_time}}</span>
						<span v-if="exception_status == 1 && type == 2">{{item.desc}}</span><br>
						<span v-if="exception_status == 1 && type == 2">{{item.add_time}}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'goodsone',
		data() {
			return {
				status: '',
				listarr: [],
				baoguonumber: '',
				jianshu: 0,
				dangkou: '',
				id: null,
				arrive_img: '',
				exception_status:"",		//0:普通状态；1:标记异常状态
				type:"",					//1:普通状态；1:标记异常状态
			}
		},
		created() {
			document.title = "包裹状态详情";
			this.id = sessionStorage.getItem('id');
			this.exception_status = sessionStorage.getItem('status');
			this.type = sessionStorage.getItem('type');
			this.userlist();
		},
		methods: {
			goback() {
				window.history.go(-1);
			},
			userlist() {
				if(this.exception_status == 0 || (this.exception_status == 1 && this.type == 1)){
					this.$axios.get('admin/goods/detail', {
						params: {
							id: this.id
						}
					})
					.then(res => {
						this.baoguonumber = res.data.data.info.id;
						this.jianshu = res.data.data.info.goods_num;
						this.dangkou = res.data.data.info.supplier_id;
						this.listarr = res.data.data.list;
						this.status = res.data.data.info.status;
						this.arrive_img = res.data.data.info.arrive_img
					});
				}else{
					this.$axios.get('admin/goods/exceptionlog', {
						params: {
							package_id: this.id
						}
					})
					.then(res => {
						this.baoguonumber = res.data.data.info.id;
						this.jianshu = res.data.data.info.goods_num;
						this.dangkou = res.data.data.info.supplier_name;
						this.listarr = res.data.data.list;
						this.status = res.data.data.info.status;
					});
				}
			}
			
		},
		filters: {
			status(value) {
				if (value == 0) {
					return '创建包裹'
				};
				if (value == 1) {
					return '打包完成'
				}
				if (value == 2) {
					return '已装车'
				}
				if (value == 3) {
					return '已下车'
				}
				if (value == 4) {
					return '已送达'
				}
				if (value == 5) {
					return '已确认'
				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes move {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.goodslist {
	width: 100%;
	height: 100%;
}

.container {
	width: 100%;
	display: flex;
	margin-bottom: 20px;
}

.container>li:nth-child(1) {
	animation: move 1s ease;
}

.container>li:nth-child(3) {
	animation: move 5s ease;
}

.container>li:nth-child(5) {
	animation: move 10s ease;
}

.span1 {
	animation: move 2.5s ease;
}

.span2 {
	animation: move 7.5s ease;
}

.container>li {
	flex: 1;
	font-size: 32px;
}

.list {
	width: 100%;
	height: auto;
	display: flex;
}

.list>li {
	flex: 1;
	font-size: 16px;
}

.contain {
	width: 80%;
	height: 600px;
	background: #eee;
	margin: 50px auto;
	overflow: hidden;
	overflow-y: auto;
	padding-left: 150px;

}

h2 {
	text-align: left;
	line-height: 60px;
}

.line {
	border-left: 2px solid #FFFFFF;
	height: auto;
	margin-left: 25px;

}

.line>ul>li {
	position: relative;
	margin-bottom: 30px;
	font-size: 16px;
	text-align: left;
	padding-left: 25px;
}

.point {
	position: absolute;
	top: 0;
	left: -8px;
	font-size: 16px;
	color: #1D8CE0;
}

.btnleft {
	text-align: right;
	padding-right: 50px;
}

.vue-directive-image-previewer {
	opacity: 0 !important;
	background: #FFFFFF !important;
}
</style>
