import Vue from 'vue'
import VueRouter from 'vue-router'
import Section from '@/views/Teachers/Class/Section.vue'

Vue.use(VueRouter)

const sectionroutes = [
    {
        path: '/teachers/section',
        name: 'Section',
        component: Section,
        meta:{
            title:"章节"
        },
    }
]
export default sectionroutes