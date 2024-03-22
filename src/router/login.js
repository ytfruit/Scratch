import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'

Vue.use(VueRouter)

const loginroutes = [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta:{
        title:"登录"
       },
    }
   
    
]
  
export default loginroutes