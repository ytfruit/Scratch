import Vue from 'vue'
import VueRouter from 'vue-router'
import TClass from '@/views/Teachers/Class/TClass'
Vue.use(VueRouter)

const tclassroutes = [
    {
      path: '/teachers/tclass',
      name: 'TClass',
      component: TClass,
      meta:{
        title:"班级管理"
       },
    } 
]
  
export default tclassroutes