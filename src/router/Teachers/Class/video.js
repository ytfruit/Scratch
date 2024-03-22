import Vue from 'vue'
import VueRouter from 'vue-router'
import Video from '@/views/Teachers/Class/Video'

Vue.use(VueRouter)

const videoroutes = [
    {
      path: '/teachers/video',
      name: 'Video',
      component: Video,
      meta:{
        title:"课程管理"
       },
    }
   
    
]
  
export default videoroutes