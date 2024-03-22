import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/Register'

Vue.use(VueRouter)

const registerroutes = [
    {
        path: '/Register',
        name: 'Register',
        component: Register,
        meta:{
          title:"注册"
         },
      },
]

export default registerroutes