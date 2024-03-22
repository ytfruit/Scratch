import Vue from 'vue'
import VueRouter from 'vue-router'
import BasicMessage from '@/views/Teachers/Class/BasicMessage'

Vue.use(VueRouter)

const basicmessageroutes = [
    {
      path: '/teachers/basicmessage',
      name: 'BasicMessage',
      component: BasicMessage,
      meta:{
        title:"基本信息"
       },
    }
   
    
]
  
export default basicmessageroutes