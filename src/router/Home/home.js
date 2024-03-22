import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home'

Vue.use(VueRouter)

const homeroutes = [
    {
        path:'/scratch/home',
        name:'Home',
        component:Home,
        meta:{
            title:"首页"
           },
    },
]
  
export default homeroutes