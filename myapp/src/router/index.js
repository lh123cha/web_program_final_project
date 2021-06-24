import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '../components/user/user'
import Register from'../components/user/register'
import Search from '../components/user/search'
import Search_home from '../components/user/search_home'
import Echarts from '../components/admin/charts'
import Admin from '../components/user/admin_view'

import Home from '../components/user/home'

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/login',
      name: 'login',
      component:User
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path:'/search_home',
      name:'search_home',
      component:Search_home,
      meta: {
        requireAuth: true
      },
      children:[
        {
          path:'/search_home/search_table',
          component:Search,
          meta: {
            requireAuth: true
          },
        },{
          path:'/search_home/search_charts',
          component:Echarts,
          meta:{
            requireAuth:true
          },
        }
      ]
    },
    {
      path:'/admin_home',
      component:Home,
      meta: {
        requireAuth: true
      },
      children:[
        {
        path:'/admin_home/basetable',
        component:Admin,
          meta: {
            requireAuth: true
          }
      }
      ]
    }
  ]
})
export default router

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (sessionStorage.getItem("token") == 'true') { // 判断本地是否存在token
      next()
    } else {
      // 未登录,跳转到登陆页面
      next({
        path: '/login'
      })
    }
  } else {
    if(sessionStorage.getItem("token") == 'true'){
      next('/search_home');
    }else{
      next();
    }
  }
});
// 导航守卫
// 参数1 : to 目标路由对象
// 参数2 : from 来源路由对象
// 参数3 : next() 下一步
// router.beforeEach((to, from, next) => {
//   // 1. 判断是不是登录页面
//   // 是登录页面
//   if(to.path === '/login') {
//     next()
//   } else {
//     // 不是登录页面
//     // 2. 判断 是否登录过
//     let token = localStorage.getItem('token')
//     token ? next() : next('/login')
//   }
// })


