import Vue from 'vue'
import VueRouter from 'vue-router'
import Students from '@/views/Teachers/Class/Students'

Vue.use(VueRouter)

const studentsroutes = [
    {
      path: '/teachers/students',
      name: 'Students',
      component: Students,
      meta:{
        title:"学生信息"
       },
    }
   
    
]
  
export default studentsroutes