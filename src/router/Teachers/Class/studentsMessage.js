import Vue from 'vue'
import VueRouter from 'vue-router'
import studentsMessage from '@/views/Teachers/Class/studentsMessage'

Vue.use(VueRouter)

const studentsmessageroutes = [
    {
      path: '/teachers/studentsmessage',
      name: 'studentsMessage',
      component: studentsMessage,
      meta:{
        title:"学生信息"
       },
    }
   
    
]
  
export default studentsmessageroutes