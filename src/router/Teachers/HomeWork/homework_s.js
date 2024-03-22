import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeWork_S from '@/views/Teachers/HomeWork/HomeWork_S.vue'

Vue.use(VueRouter)

const homework_sroutes = [
    {
        path: '/teachers/homework_S',
        name: 'HomeWork_S',
        component: HomeWork_S,
        meta:{
            title:"批改作业"
        },
    }


]

export default homework_sroutes
