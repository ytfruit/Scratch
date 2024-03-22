import Vue from 'vue'
import VueRouter from 'vue-router'

import loginroutes from '../router/login'
import registerroutes from '../router/register'
import ScratchIndex from '../views/ScratchIndex'

//学生端
import searchroutes from '../router/Home/search'
import Courseroutes from '../router/Home/course'
import homeroutes from '../router/Home/home'
import homeworkroutes from '../router/Home/homework'
import spaceroutes from '../router/Home/space'
import myworkroutes from '../router/Home/mywork'
import section_croutes from "@/router/Home/section_c";
import submitroutes from '../router/Home/submitwork'

//教师端
import Teachers from '@/views/Teachers/Teachers'
import studentsmessageroutes from './Teachers/Class/studentsMessage'
import tclassroutes from './Teachers/Class/tclass'
import videoroutes from './Teachers/Class/video'
import thomeworkroutes from './Teachers/HomeWork/thomework'
import questionroutes from './Teachers/HomeWork/question'
import basicmessageroutes from './Teachers/Class/basicmessage'
import detailroutes from './Teachers/Class/detail'
import studentsroutes from './Teachers/Class/students'
import class_detailroutes from "@/router/Teachers/Class/class_detail";
import sectionroutes from "@/router/Teachers/Class/section";
import homework_sroutes from "@/router/Teachers/HomeWork/homework_s";
import scoreroutes from "@/router/Teachers/HomeWork/score";

Vue.use(VueRouter)

//学生端
const routes = [
  //登录注册
  ...loginroutes,
  ...registerroutes,
  {
    path:'/scratch',
    name:'Scratch',
    component:ScratchIndex,
    redirect:'/scratch/homework',
    children:[
      // ...homeroutes,
      ...searchroutes,
      ...Courseroutes,
      ...homeworkroutes,
      ...spaceroutes,
      ...myworkroutes,
      ...section_croutes,
      ...submitroutes
    ],
    meta:{
      title:"首页"
    }
  },

  //教师端
  {
    path:'/teachers',
    name:'Teacher',
    component:Teachers,
    redirect:'/teachers/video',
    children:[
      ...studentsmessageroutes,
      ...tclassroutes,
      ...videoroutes,
      ...thomeworkroutes,
      ...questionroutes,
      ...class_detailroutes,
      ...sectionroutes,
          ...homework_sroutes,
        ...scoreroutes
    ],
    meta:{
      title:"教师空间"
    },
    ...basicmessageroutes,
    ...studentsroutes,
    ...detailroutes,
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title=to.meta.title;
  }
  next()
})

export default router

/*解决导航栏路由多次跳转问题*/
//先把VueRouter原型对象的push,先保存一份
let originPush = VueRouter.prototype.push;
let originReplace=VueRouter.prototype.replace;

//第一个参数: 告诉原来push 方法，你往哪里跳转(传递哪些参数)
VueRouter.prototype.push = function(location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject);
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};
