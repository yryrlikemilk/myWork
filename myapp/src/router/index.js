import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index'
import VersionsManage from '@/views/versionsManage/versionsManage'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      component: () => import('@/views/index/index'),
      hidden: true
    },
    {
      path: '/info',
      component: () => import('@/views/index/info'),
      hidden: true
    },
    {
      path: '/versionsManage',
      name: 'VersionsManage',
      component: VersionsManage
    },
    {
      path: '/versionsManageAdd',
      name: 'VersionsManageAdd',
      component: () => import('@/views/versionsManage/versionsManageAdd')
    }
  ]
})
