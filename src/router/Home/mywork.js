import Vue from 'vue'
import VueRouter from 'vue-router'
import MyWork from '@/views/index/MyWork'

Vue.use(VueRouter)

const myworkroutes = [
    {
        path:'/scratch/MyWork',
        name:'MyWork',
        component:MyWork,
        meta:{
            title:"作业详情"
           },
    },
]
  
export default myworkroutes