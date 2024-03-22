import Vue from 'vue'
import VueRouter from 'vue-router'
import SubmitWork from '@/views/index/SubmitWork'

Vue.use(VueRouter)

const submitworkroutes = [
    {
        path:'/scratch/SubmitWork',
        name:'SubmitWork',
        component:SubmitWork,
        meta:{
            title:"scratch在线提交平台",
           },
    },
]

export default submitworkroutes
