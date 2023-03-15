import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login' //登录
import HelloWorld from '@/components/page/HelloWorld' //首页详情
import home from '@/components/page/home' //首页
import error from '@/components/page/error' //404
import leftnav from '@/components/page/leftnav' //退货
import return_goods from '@/components/page/return_goods' //退货
import goodslist from '@/components/page/goodslist' //退货
import tag_record from '@/components/page/tag_record' //标记记录列表
import pageack from '@/components/page/pageack' //近期查看包裹详情
import totle from '@/components/page/totle' //首页数据统计
import warn from '@/components/page/warn' //报警提示管理
import goodsone from '@/components/page/goodsone' //报警提示管理详情
import userprovide from '@/components/page/userprovide' //供应商管理
import nouser from '@/components/page/nouser' //报警提示管理详情
import manually from '@/components/page/manually' //手动录入
import listgood from '@/components/page/listgood' //报警提示管理详情
import listli from '@/components/page/listli' //报警提示管理详情
import print from '@/components/page/print' //报警提示管理详情
import getPackage from '@/components/page/getPackage' //拿货管理


Vue.use(Router)
const router = new Router({
	routes: [
	// {
	// 	path: '*',
	// 	name: 'error',
	// 	component: error,
	// },
	// {
	// 	path: '/',
	// 	redirect: '/login'
	// },
	{
		path: '/login',
		name: 'login',
		component: login
	},
	{
		path: '/home',
		component: home,
		children: [{
			path: '/',
			redirect: '/HelloWorld'
		},
		{
			path: '/HelloWorld',
			component: HelloWorld
		},
		{
			path: '/leftnav',
			component: leftnav,
		},
		{
			path: '/return_goods',
			component: return_goods,
		},
		{
			path: '/goodslist',
			component: goodslist,
		},
		{
			path: '/tag_record',
			component: tag_record,
		}, {
			path: '/pageack',
			component: pageack,
		}, {
			path: '/totle',
			component: totle
		}, {
			path: '/warn',
			component: warn
		}, , {
			path: '/goodsone',
			component: goodsone
        },
        {
        	path: '/userprovide',
        	component: userprovide
        },
        {
        	path: '/nouser',
        	component: nouser
        },
        {
        	path: '/manually',
        	component: manually
        },
        {
        	path: '/listgood',
        	component: listgood
        },
        {
        	path: '/listli',
        	component: listli
        }, {
        	path: '/print',
        	component: print
        },{
        	path: '/getPackage',
        	component: getPackage
        },

        ]
    }
    ]
})
export default router;
router.beforeEach(function(to, from, next) {
	localStorage.setItem('pathurl', to.path)
	next()
})
