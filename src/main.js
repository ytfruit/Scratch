import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
import 'element-ui/lib/theme-chalk/display.css';

import axios from 'axios';
Vue.prototype.$http=axios;
axios.defaults.baseURL='/api'

import { postRequest } from './utils/api';
import { putRequest } from './utils/api';
import { getRequest } from './utils/api';
import { deleteRequest } from './utils/api';

import { showLoading,hideLoading } from './loading';

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
    el.querySelector('input').focus()
  }
})
//注册一个兄弟组件用来传值的实例
Vue.prototype.$bus=new Vue()

Vue.config.productionTip = false
Vue.use(ElementUI);

//注册视频组件
import "video.js/dist/video-js.css";
// import videojs from "video.js";
// import VideoJS from 'video.js'
import videojs from "video.js";


//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

/*
路由导航守卫：注册全局前置守卫
to是即将进入的目标路由对象，from是即将要离开的路由，next是跳到下一个路由
*/
router.beforeEach((to,from,next)=>{
  if(window.sessionStorage.getItem('token')){
     next();
  }else{
      next();
  }
})


new Vue({
  router,
  store,
  showLoading,
  hideLoading,
  render: h => h(App)
}).$mount('#app')
