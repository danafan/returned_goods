<template>
	<div class="home">
		<el-container>
			<el-header>
				<Icon type="md-person" /><span class="fontuser">{{ admin }}</span>
				<Icon type="md-power" /><span class="fontuser" @click="loginout">退出</span>
			</el-header>
			<el-container>
				<el-aside width="240px">
					<Col span="8">
					<Menu :theme="theme2" :active-name="childarr" :open-names="parentarr" :accordion="show" @on-select="openselect"
					 @on-open-change="openchange">
						<Submenu name="1">
							<template slot="title">
								<Icon type="ios-paper" />
								首页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</template>
							<MenuItem name="1-1" to="/HelloWorld">首页</MenuItem>
						</Submenu>
						<Submenu name="2">
							<template slot="title">
								<i class="el-icon-sold-out"></i>
								退货管理&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</template>
							<MenuItem name="2-1" to="/leftnav">退货管理</MenuItem>
							<MenuItem name="2-2" to="/return_goods">退货商品管理</MenuItem>
						</Submenu>
						<Submenu name="3">
							<template slot="title">
								<Icon type="ios-warning" />
								报警提示&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</template>
							<MenuItem name="3-1" to="/warn">报警提示</MenuItem>
							<MenuItem name="3-2" to="/goodslist">异常包裹记录</MenuItem>
							<MenuItem name="3-3" to="/tag_record">标记记录</MenuItem>
						</Submenu>
						<Submenu name="4">
							<template slot="title">
								<Icon type="ios-stats" />
								供应商管理&nbsp;&nbsp;&nbsp;
							</template>
							<MenuItem name="4-1" to="/userprovide">供应商管理</MenuItem>
							<MenuItem name="4-2" to="/nouser">供应商反退货管理</MenuItem>
							<MenuItem name="4-3" to="/manually">退货手动录入</MenuItem>
						</Submenu>
						<Submenu name="5">
							<template slot="title">
								<Icon type="md-car" />
								退货商品管理
							</template>
							<MenuItem name="5-1" to="/listgood">退货商品管理</MenuItem>
						</Submenu>
						<Submenu name="6">
							<template slot="title">
								<Icon type="md-notifications-off" />
								作废包裹管理
							</template>
							<MenuItem name="6-1" to="/listli">作废包裹管理</MenuItem>
						</Submenu>
						<Submenu name="7">
							<template slot="title">
								<Icon type="md-notifications-off" />
								拿货管理
							</template>
							<MenuItem name="7-1" to="/getPackage">拿货管理</MenuItem>
						</Submenu>
					</Menu>
					</Col>
				</el-aside>
				<el-main>
					<keep-alive exclude="goodsone">
						<router-view></router-view>
					</keep-alive>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import $axios from '@/axios/http.js'
	export default {
		name: 'home',
		data() {
			return {
				show: true, //自动伸缩
				theme2: 'light',
				admin: '', //用户名
				parentarr: [], //父菜单
				childarr: '' //子菜单
			}
		},
		methods: {
			//退出
			loginout() {
				this.$axios.get('admin/loginout', {
						params: {

						}
					})
					.then(res => {
						console.log(res);
						if (res.data.code == 1) {
							this.$router.push({
								path: '/login'
							})
						}
					})
				localStorage.clear();

			},
			openselect(key) {
				localStorage.setItem('childarr', key) //缓存子元素

			},
			openchange(key) {
				localStorage.setItem('parentarr', key) //缓存父元素

			}
		},
		mounted() {

		},
		created() {
			document.title = "首页";
			this.admin = localStorage.getItem('admin');
			this.childarr = localStorage.getItem('childarr');
			this.parentarr.push(localStorage.getItem('parentarr'));
			this.$axios.get('admin/login', {
					params: {

					}
				})
				.then(res => {
					this.admin = res.data.data.admin_name;
					localStorage.setItem('admin', res.data.data.admin_name);
					if (res.data.code == 10000) {
						this.$Message.error(res.data.msg);
						this.$router.push({
							path: '/login'
						});
					} else {
						let url = localStorage.getItem('pathurl');
						if(localStorage.getItem('childarr')){
							this.$router.push({
								path: url
							});
						};
					}
				});


		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.el-header,
	.el-footer {
		color: #333;
		text-align: center;
		line-height: 60px;
		border-bottom: 1px solid #CCCCCC;
		font-size: 24px;
		text-align: right;
	}

	.el-aside {
		color: #333;
		text-align: center;
		height: 909px;
		/* border-right: 1px solid #CCCCCC; */
		overflow: hidden;
	}

	.el-main {
		color: #333;
		text-align: center;
		border-left: 1px solid #CCCCCC;
	}

	body>.el-container {
		margin-bottom: 40px;
	}

	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
		line-height: 260px;
	}

	.el-container:nth-child(7) .el-aside {
		line-height: 320px;
	}

	.fontuser {
		font-size: 16px;
		margin: 20px;
		cursor: pointer;
	}
</style>
