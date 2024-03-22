<template>
  <body>
    <div class="bgcimage">
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px" class="registerContainer">
            <h2 class="registertitle">
                欢迎注册Scrach在线学习平台
            </h2>
            <el-form-item label="用户名" prop="name">
                <el-input clearable type="text" placeholder="请输入用户名" v-model="registerForm.name" id="name" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNumber">
                <el-input clearable type="text" placeholder="请输入手机号" v-model="registerForm.phoneNumber" id="phoneNumber" auto-complete="false" maxlength="11"></el-input>
            </el-form-item>
<!--            <el-form-item label="验证码" prop="code" style="position: relative;">-->
<!--                <el-input type="text" placeholder="请输入验证码" v-model="registerForm.code" id="code" auto-complete="false" maxlength="4">-->
<!--                <el-button slot="suffix" :disabled="disabled" @click="getcode" type="text" style="position:absolute;right: 0px;top:1%;cursor: pointer;"><span style="width: 40px;font-size: 12px;">{{ btnTxt }}</span></el-button>-->
<!--              </el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="密码" prop="password1">
                 <el-input clearable show-password type="password" placeholder="请输入密码" v-model="registerForm.password1" id="password1" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="password2">
                 <el-input clearable show-password type="password" placeholder="请再次输入密码" v-model="registerForm.password2" id="password2" autocomplete="off"></el-input>
            </el-form-item>
                 <el-button round type="primary" style="width: 100%" @click="submitRegister" >注册</el-button>
            <div style="flex: 1;text-align: right">
             已有账号？<router-link to="/">返回登录</router-link>
            </div>
        </el-form>
      <el-dialog :title="'选择注册身份'" :visible="dialog" @close="closedialog" style="line-height: normal">
        <template>
          <el-radio v-model="radio" label="1">学生</el-radio>
          <el-radio v-model="radio" label="2">教师</el-radio>
        </template>
        <el-button type="primary" @click="become_teachers">确认</el-button>
      </el-dialog>
    </div>
  </body>

</template>

<script>
import Login from "@/router/login";

export default {
    name:"Register",
    data() {
      var validatorPhone = function(rule,value,callback){
        if(value){
          if(!/1[235789]\d{9}/.test(value)){
            callback(new Error('手机号格式有误'))
          }else{
            callback()
          }
        }
      };
        var validatePass = (rule, value, callback) => {
       // let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
        if (value === '') {
          callback(new Error('请输入密码'));
        } /*else if(value.length<8 || !reg.test(value)){
            callback(new Error('请输入含数字和字母的8-16位密码'))
        }*/
        else{
          if (this.registerForm.password2 !== '') {
            this.$refs.registerForm.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        radio:'',
        code:'',
        dialog:false,
        // btnTxt:'获取验证码',
        // disabled:false,//是否禁用过一段时间才能点击
        // time:0,//时间
        registerForm: {
          name: '',
          phoneNumber:'',
          //code:'4444',
          password1: '',
          password2: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        phoneNumber:[
            {required:true,message:'请输入11位手机号',trigger:'blur'},
            {required:true,message:'长度不符合',trigger:'blur',min:11,max:11},
            {validator:validatorPhone,trigger:'blur'}
          ],
          /*code:[
            {required:true,message:'请输入4位验证码',trigger:'blur'},
            {required:true,message:'验证码错误',trigger:'blur',min:4,max:4},
          ],
          */
          password1: [
            {required: true, message: '请输入密码', validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      closedialog(){
        this.dialog=false
      },
      become_teachers(){
        if(this.radio==='2'){
          this.code='teacher'+localStorage.getItem("phoneNumber")
          let formdata=new FormData()
          formdata.append("code",this.code)
          localStorage.setItem("phoneNumber",this.registerForm.phoneNumber)
          localStorage.setItem("password",this.registerForm.password1)
          this.postRequest('/homepage/setTeacherType',formdata).then(resp=>{
            if(resp.code===1){
              this.$message.success("教师注册成功！前往登录...")
              setTimeout(()=>{
                this.$router.replace('/')
              },3000)
            }
          })
        }else if(this.radio==='1'){
          this.$message.success("学生注册成功，前往登录...");
          localStorage.setItem("phoneNumber",this.registerForm.phoneNumber)
          localStorage.setItem("password",this.registerForm.password1)
          setTimeout(() => {
           this.$router.replace('/')
          }, 3000)
        }
      },
      submitRegister() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            //验证通过
            this.postRequest('/register', this.registerForm).then(resp => {
              // console.log(resp);
              if (resp.code === 1) {
                //存储用户token
                localStorage.setItem('phoneNumber',this.registerForm.phoneNumber);
                localStorage.setItem('password',this.registerForm.password)
                const token = resp.data;
                localStorage.setItem("token",token);
               // 跳转首页
                this.dialog=true
                this.become_teachers()
              } else {
                this.$message.error(resp.msg);
              }
            })
          }
        });
      },
      // getcode(){
      //   if(!this.registerForm.phoneNumber){
      //     //校验手机号码不通过
      //     this.$message({
      //       message:'请输入手机号',
      //       type:'error',
      //     });
      //     //正则表达式判断从1开始
      //   }else if(!/1[2345789]\d{9}/.test(this.registerForm.phoneNumber)){
      //     //失去焦点后自动触发校验规则
      //   }else {
      //     this.time = 60;
      //     this.disabled = true;
      //     //调用倒计时方法
      //     this.timer();
      //封装axios接口
      //     GetPhoneNumber({
      //
      //     }).then(({data})=>{
      //       if(data.code===200){
      //         this.$message({
      //           message:'验证成功',
      //           type:'success',
      //         })
      //       }else{
      //         this.$message({
      //           message:'发送失败',
      //           type:'warning',
      //         })
      //       }
      //     })
      //   }
      // },
      //   timer(){
      //     if(this.time>0){
      //       this.time--;
      //       this.btnTxt=this.time+'s后重新获取';
      //       setTimeout(this.timer,1000);
      //     }else{
      //       this.time=0;
      //       this.btnTxt='获取验证码';
      //       this.disabled=false;
      //     }
      //   }
      // }
    }

}
 </script>

<style lang="less" scoped>
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
.bgcimage{
        background-image: url(../assets/loginbg.webp);
        background-size:contain;
        width: 100%;
        height: 100%;
        overflow:auto;
    }
.registertitle{
        margin: 0 auto 40px auto;
        text-align: center;
        color: #352626;
        font-family:'幼圆',serif;
        font-weight: bold;
}
.registerContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin:180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background-color: #fff;
        border: 1px solid #8badd9;
        box-shadow: 0 0 25px #83877c;
        .el-input__inner{
          width:120%;
          border:0;
          border-bottom: solid;
        }
}

</style>
