// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import animate from 'animate.css'
import VueAxios from 'vue-axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import echarts from 'echarts'
import "babel-polyfill";
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import Print from 'vue-print-nb'
　　Vue.use(Print); //注册
Vue.use(VueDirectiveImagePreviewer,{
  background: {     // or : background: '#000'
    color: '#ffffff' // or rgba or rgb     // or image: 'url(xxx)'
  },
})
Vue.prototype.$echarts = echarts
Vue.use(iView);
Vue.use(ElementUI);
Vue.use(animate)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})