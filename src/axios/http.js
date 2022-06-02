import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '@/router'
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/';
axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded';
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
// 添加请求拦截器
axios.interceptors.request.use(config => {
	// console.log(config)
	return config
}), error => {
	// console.log(error)
};
axios.interceptors.response.use(response => {
	// 添加响应拦截器状态值
	switch (response.data.code) {
		case 10000:
			router.push({
				path: '/login'
			});
			localStorage.clear();
			break;
	}
	return response;
}), error => {
	// console.log(error);
	if (error.response) {
		switch (error.response.status) {
			case 404:
				window.alert('参数错误');      
				localStorage.clear();
				break;
			case 500:
				window.alert('服务器故障');
				localStorage.clear();
				break;
			case 504:
				window.alert('没有网络');
				localStorage.clear();
				break;
		}
	}
};
