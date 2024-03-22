import Vue from 'vue'
import VueRouter from 'vue-router'
import THomeWork from '@/views/Teachers/HomeWork/THomeWork'

Vue.use(VueRouter)

const thomeworkroutes = [
    {
      path: '/teachers/thomework',
      name: 'THomeWork',
      component: THomeWork,
      meta:{
        title:"作业管理"
       },
    }
   
    
]
  
export default thomeworkroutes