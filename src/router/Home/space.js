import Vue from 'vue'
import VueRouter from 'vue-router'
import Space from '@/views/index/Space'

Vue.use(VueRouter)

const spaceroutes = [
    {
      path: '/scratch/space',
      name: 'Space',
      component:Space,
      meta:{
        title:"班级空间"
       },
    }
   
    
]
  
export default spaceroutes