<template>
         <div class="bgcimage">
        <div class="outbox">
        <el-form :rules="rules"
        v-loading="loading"
        ref="loginform"
        :model="loginform"
         class="loginContainer" :label-position="labelPosition" label-width="100px">
        <h2 class="loginTitle">
            欢迎登录Scratch在线学习平台
        </h2>
        <el-form-item prop="phoneNumber" label="账号">
            <el-input clearable  type="text" auto-complete="false" v-model="loginform.phoneNumber" id="phoneNumber"  prefix-icon="el-icon-user" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input clearable show-password type="password" auto-complete="false" v-model="loginform.password" id="password" prefix-icon="el-icon-switch-button" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
        <el-button type="primary" round style="width: 100%" @click="submitLogin">登录</el-button>
        <div style="flex: 1;text-align: right">
             还没有账号？<router-link to="/Register">立即注册</router-link>
        </div>
    </el-form>
    </div>
    </div>
</template>

<script>
export default {
    name:"Login",

    data(){
      var validatorPhone = function(rule,value,callback){
        if(value){
          if(!/1[235789]\d{9}/.test(value)){
            callback(new Error('手机号格式有误'))
          }else{
            callback()
          }
        }
      };
        return{
            labelPosition: 'left',
            loginform:{
                phoneNumber:'',
                password:'',
            },
            loading:false,
            checked:false,
            rules:{
                phoneNumber:[
                  {required:true,message:'请输入11位手机号',trigger:'blur'},
                  {required:true,message:'长度不符合',trigger:'blur',min:11,max:11},
                  {validator:validatorPhone,trigger:'blur'}
                ],
                password:[{required:true,message:"请输入密码",trigger:"blur"}],
            }
        }
    },
    methods:{
        submitLogin(){
             this.$refs.loginform.validate((valid) => {
                if (valid) {
                   this. postRequest('/login',this.loginform).then(resp=>{
                        if(resp.code===1){
                            // console.log("token是"+resp.data);
                            //存储用户token
                            localStorage.setItem('phoneNumber',this.loginform.phoneNumber);
                            localStorage.setItem('password',this.loginform.password)
                            const token = resp.data;
                            localStorage.setItem("token",token);
                            //跳转首页
                          this.postRequest('/homepage/getUserInfo').then(resp=>{
                            if(resp.data.type==='stu' && resp.code===1){
                              localStorage.setItem('name',resp.data.name)
                              this.$message.success("欢迎您！学生，正在跳转首页...");
                              setTimeout(()=>{
                                this.$router.replace('/Scratch');
                              },3000)
                            }else if((resp.data.type==='admin' || resp.data.type==='teacher')&& resp.code===1){
                              localStorage.setItem('name',resp.data.name)
                              this.$message.success("欢迎您！教师，正在跳转后台...");
                              setTimeout(()=>{
                                this.$router.replace('/teachers');
                              },3000)
                            }else{
                              this.$message.error(resp.msg)
                            }
                          })
                        }else{
                            this.$message.error(resp.msg)
                        }
                    })
                    } else {
                        this.$message({
                            showClose: true,
                            message: '请输入所有字段！',
                            type: 'error'
                        });
                         return false;
                        }
                     });
             },
        }
    }
</script>

<style lang="less" scoped>
   //跳转routerlink 相当于a标签，设置不点击颜色link，移入颜色hover,点击后颜色active
    a:link{
        color:#8badd9;
    }
    a:hover{
        color: blue;
        text-decoration: underline;
    }
    a:active{
        color: blue;
    }
    //设置背景图片
    .bgcimage{
        background-image: url(../assets/loginbg.webp);
        background-size:contain;
        width: 100%;
        height: 100vh;
        overflow:auto;
    }
    //设置登录边框
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin:180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background-color: #fff;
        border: 1px solid #8badd9;
        box-shadow: 0 0 25px #cacaca;
        overflow: hidden;
    }
    //设置标题
    .loginTitle{
        margin: 0px auto 40px auto;
        text-align: center;
        color: #352626;
        font-family:'幼圆';
        font-weight: bold;
    }
    //设置跳转链接样式
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>
