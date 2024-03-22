import axios from "axios"
import { Message } from 'element-ui';
import router from '../router'
import { showLoading,hideLoading } from "@/loading";
//import { resolve } from "core-js/fn/promise";

const instance =axios.create({
    baseURL:"http://localhost:8080",
    timeout:5000,
})

//axios请求拦截器
function getJWTToken(){
    let token;
    token = localStorage.getItem("token");
    return token;
}
instance.interceptors.request.use(config=>{
    //如果存在token，则请求携带这个token
    const user=getJWTToken();
  
    if(user){
        config.headers["token"]=user;
    }  
    axios.defaults.headers['Content-Type']='application/x-www-form-urlencoded;charset=utf-8'
    return config;
},error=>{
    return Promise.reject(error);
});

//--axios响应拦截器 success->成功调用后端接口
instance.interceptors.response.use(success=>{
    //业务逻辑
   if(success.status&&success.status===200){
    if(success.data.code===500 ||success.data.code===401||success.data.code===403){
        Message.error({message:success.data.message});
        return;
    }
    if(!success.data.code){
        success.data.contentDisposition =  success.headers['content-disposition']
    }
    // if(success.data.message){
    //     Message.success({message:success.data.message});
    // }
    // if(success.data.code==1){
    //     Message.success({message:success.data.message});
    // }
   }
   return success.data;
}, error=>{
    return Promise.reject(error);
});

const createRequest = (method,url,data = {},config={})=>{
    return instance({
        url,
        method,
        data,
        ...config,
    })
}

//传送Json格式的post请求
export const postRequest=(url,data={},config={})=>{
    return createRequest('post',url,data,config)
}

//传送Json的put请求
export const putRequest=(url,data={},config={})=>{
    return createRequest('put',url,data,config)
}

//传送Json的get请求
export const getRequest=(url,data={},config={})=>{
    return createRequest('get',url,data,config)
}

//传送Json的delete请求
export const deleteRequest=(url,params={},config={})=>{
    return createRequest('delete',url,{params,...config});
}
