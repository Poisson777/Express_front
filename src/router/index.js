import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Regist from '../components/Regist.vue'
import ForggetPass from '../components/ForgetPass.vue'


import Home from '../components/Home.vue'
import Expressman from '../components/Expressman.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import NetList from '../components/admin/NetList'
import LogList from '../components/admin/LogList'
import ExpressmanList from '../components/admin/ExpressmanList.vue'
import ServiceManage from '../components/admin/ServiceManage.vue'
import ExpressList from '../components/admin/ExpressList.vue'




import MyExpress from'../components/expressman/MyExpress.vue'
import Uself from '../components/expressman/Uself.vue'
import NearNetStation from '../components/expressman/NearNetStation'
import Receiving from '../components/expressman/Receiving'
import Identify from '../components/expressman/Identify'
import ConfirmRec from '../components/expressman/ConfirmRec'
import Pickup from '../components/expressman/Pickup.vue'
import Welcomeex from '../components/Welcomeex.vue'

import NetHome from '../components/Net.vue'
import mailmanage from '../components/net/mailmanage.vue'
import Netself from '../components/net/Netself.vue'
import Mail from '../components/net/Mail.vue'
import Personnel from '../components/net/Personnel.vue'
import Dispatch from '../components/net/Dispatch.vue'
import InExpress from '../components/net/InExpress.vue'
import Welcomenet from '../components/Welcomenet.vue'

import User from '../components/User.vue'
import FromExpress from '../components/user/FromExpress.vue'
import ToExpress from '../components/user/ToExpress.vue'






Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login
  }, 
  {
    path:"/regist",
    component:Regist
  }, 
  {
    path:"/forgetpass",
    component:ForggetPass
  }, 

  
  {
    path:"/admin",
    component:Home,
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        component:Welcome,
      },
      {
        path:"/user",
        component:UserList,
      },
      {
        path:"/net",
        component:NetList,
      },
      {
        path:"/log",
        component:LogList,
      },
      {
        path:"/expressmanlist",
        component:ExpressmanList,
      },
   
      {
        path:"/service",
        component:ServiceManage,
      },
      {
        path:"/express",
        component:ExpressList
      }
      
    ]
  }, 



  {
    path:"/expressman",
    
    component:Expressman,
    redirect:"/Welcomeex",
    children:[
      {
        path:"/Welcomeex",
        component:Welcomeex,
      },
      {
        path:"/myexpress",
        component:MyExpress,
      },
      {
        path:"/uself",
        component:Uself,
      },
      {
        path:"/receiving",
        component:Receiving,
      },
      {
        path:"/nearnetstation",
        component:NearNetStation,
      },
      {
        path:"/identify",
        component:Identify,
      },
      {
        path:"/confirmrec",
        component:ConfirmRec,
      },
      {
        path:"/pickup",
        component:Pickup,
      },

    ]
  }, 



  {
    path:"/nethome",
    component:NetHome,
    redirect:"/Welcomenet",
    children:[
      {
        path:"/Welcomenet",
        component:Welcomenet,
      },
      {
        path:"/dispatch",
        component:Dispatch,
      },
      {
        path:"/mailmanage",
        component:mailmanage,
      },
      {
        path:"/netself",
        component:Netself,
      },
      {
        path:"/mail",
        component:Mail,
      },
      {
        path:"/personnel",
        component:Personnel,
      },
      {
        path:"/inexpress",
        component:InExpress,
      },

    ]
  }, 



  {
    path:"/commonuser",
    component:User,
    redirect:"/fromexpress",
    children:[
      {
        path:"/fromexpress",
        component:FromExpress,
      },
      {
        path:"/toexpress",
        component:ToExpress,
      },
    //   {
    //     path:"/mailmanage",
    //     component:mailmanage,
    //   },
    //   {
    //     path:"/netself",
    //     component:Netself,
    //   },
    //   {
    //     path:"/mail",
    //     component:Mail,
    //   },
    //   {
    //     path:"/personnel",
    //     component:Personnel,
    //   },
    //   {
    //     path:"/inexpress",
    //     component:InExpress,
    //   },

    ]
  }, 
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
// router.beforeEach((to,from,next)=>{
//   //to将要访问的路径，from从哪里来，next接着干的事情 next(url)重定向到url上，如果为空，继续访问to的路径
//   if(to.path=='/login') return next();
//   //获取user
//   const userFlag = window.sessionStorage.getItem("user");  //取出会话层的用户
//   if(!userFlag){
//     return next('/login'); //无值返回登录页
//   }
//   next();  //符合要求放行


// });
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to将要访问的路径，from从哪里来，next接着干的事情 next(url)重定向到url上，如果为空，继续访问to的路径
  if(to.path=='/login') return next();
  if(to.path=="/regist") return next();
  if(to.path=="/forgetpass") return next();
  //获取user
  const userFlag = window.sessionStorage.getItem("userInfo");  //取出会话层的用户
  if(!userFlag){
    alert("请先登录");
    return next('/login'); //无值返回登录页
  }
  next();  //符合要求放行

});



export default router
