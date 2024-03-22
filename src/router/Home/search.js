import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '@/views/index/Search'

Vue.use(VueRouter)

const searchroutes = [
    {
        path:'/scratch/Search',
        name:'Search',
        component:Search
    },
]
  
export default searchroutes