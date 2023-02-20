<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'App',
		created(){
			
			// this.$axios.get('admin/logintest', {
				
			// })
			// .then(res => {
			// 	this.$router.push({
			// 			path: '/home'
			// 		});
			// });
			// return;
			
			this.$axios.get('admin/login', {
				
			})
			.then(res => {
				if (res.data.code == 0) {
					this.$router.push({
						path: '/login'
					});
				};
				if(res.data.code == 1){
					this.$router.push({
						path: '/home'
					});
				}
			});
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	h3 {
		font-size: 18px;
		font-family: arial;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		cursor: pointer;
	}
	.el-table th>.cell{
		text-align: center;
	}
	.el-table--enable-row-transition .el-table__body td{
		text-align: center;
	}
	.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
		padding:14px 24px 14px 0 
	}
    .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{
		text-align: left;
		padding-left: 90px !important;
	}	
	.ivu-menu-submenu-title span>i, .ivu-menu-submenu-title>i{
		position: absolute;
		left: 10%;
		top:18px
	}
	.vue-directive-image-previewer{
		opacity: 1 !important;
		background: #FFFFFF !important;
	}
	.vue-directive-image-previewer-background{
		opacity: 0 !important;
		background: #FFFFFF !important;
	}
</style>
