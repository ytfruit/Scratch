import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeWork from '@/views/index/HomeWork'

Vue.use(VueRouter)

const homeworkroutes = [
    {
      path: '/scratch/homework',
      name: 'HomeWork',
      component: HomeWork,
      meta:{
        title:"我的作业"
       },
    }
   
    
]
  
export default homeworkroutes