<template>

		<div class="login">
			<section>
				<h3>退货管理系统ERP</h3>
				<div id="login_container"></div>
			</section>
		</div>
	
</template>
<script>
	export default {
		name: 'login',
		data() {
			return {
				appkey:""
			}
		},
		created(){
			//获取appkey
			this.getAppKey();
		},
		methods: {
			//获取appkey
			getAppKey(){
				this.$axios.get('admin/getdingappkey', {

				})
				.then(res => {
					if (res.data.code == 1) {
						this.appkey = res.data.data.appkey;
						this.dd();
					}else{
						this.$Message.error(res.data.msg);
					}
				})
			},
			dd(){
				var goto_url = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid='+ this.appkey +'&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+`${location.origin}/admin/dinglogin`);
				var obj = DDLogin({
					id:"login_container",
					goto: goto_url, 
					style: "border:none;background-color:#FFFFFF;",
					width : "365",
					height: "400"
				});
				var handleMessage = function (event) {
					var origin = event.origin;
					if( origin == "https://login.dingtalk.com" ) { 
						var loginTmpCode = event.data; 
						window.location.href = "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=SuiteKey&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=REDIRECT_URI&loginTmpCode=" + loginTmpCode;
					}
				};
				if (typeof window.addEventListener != 'undefined') {
					window.addEventListener('message', handleMessage, false);
				} else if (typeof window.attachEvent != 'undefined') {
					window.attachEvent('onmessage', handleMessage);
				}
			}
		},
		
	}
</script>

<style scoped>
.login {
	width: 100%;
	height: 100%;
	background: url(../assets/login.jpg) no-repeat;
	background: cover;
	background-position: center;
	position: relative;
	overflow: hidden;
}

section {
	width: 600px;
	height: 500px;
	background: rgba(0, 0, 0, 0.4);
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 50px;
}

h3 {
	width: 100%;
	height: 60px;
	line-height: 60px;
	font-size: 32px;
	font-family: 'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif';
	color: #FFFFFF;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: pointer;
}

#login {
	margin-top: 50px;
}

.login_top {
	width: 80%;
}

#captcha {
	width: 140px;
	float: right;
	height: 32px;
	cursor: pointer;
}
</style>
