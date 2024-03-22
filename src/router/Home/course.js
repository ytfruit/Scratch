import Vue from 'vue'
import VueRouter from 'vue-router'
import Course from '@/views/index/Course'

Vue.use(VueRouter)

const courseroutes = [
    {
        path:'/scratch/Course',
        name:'Course',
        component:Course
    },
]
  
export default courseroutes