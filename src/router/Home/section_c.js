import Vue from 'vue'
import VueRouter from 'vue-router'
import Section_c from '@/views/index/Section_c.vue'

Vue.use(VueRouter)

const section_croutes = [
    {
        path: '/scratch/section_c',
        name: 'Section_c',
        component:Section_c,
        meta:{
            title:"章节"
        },
    }


]

export default section_croutes