import Vue from 'vue'
import VueRouter from 'vue-router'
import Class_Detail from '@/views/Teachers/Class/Class_Detail'

Vue.use(VueRouter)

const class_detailroutes = [
    {
        path: '/teachers/class_detail',
        name: 'Class_Detail',
        component: Class_Detail,
        meta:{
            title:"班级查看详情"
        },
    }
]
export default class_detailroutes