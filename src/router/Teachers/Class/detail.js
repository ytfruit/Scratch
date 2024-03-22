import Vue from 'vue'
import VueRouter from 'vue-router'
import Detail from '@/views/Teachers/Class/Detail'

Vue.use(VueRouter)

const detailroutes = [
    {
      path: '/teachers/detail',
      name: 'Detail',
      component: Detail,
      meta:{
        title:"查看详情"
       },
    }
   
    
]
  
export default detailroutes