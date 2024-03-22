import Vue from 'vue'
import VueRouter from 'vue-router'
import Question from '@/views/Teachers/HomeWork/Question'

Vue.use(VueRouter)

const questionroutes = [
    {
      path: '/teachers/question',
      name: 'Question',
      component: Question,
      meta:{
        title:"创建题目"
       },
    }
   
    
]
  
export default questionroutes