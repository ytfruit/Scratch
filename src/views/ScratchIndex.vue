<template>
    <div style="width: 99%;">
    <el-header >
      <el-col :span="24">
      <el-menu :default-active="this.$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
  <!-- <el-menu-item index="/scratch/home"><i class="el-icon-s-home"></i>首页</el-menu-item> -->
  <el-menu-item index="/scratch/homework"><i class="el-icon-notebook-1"></i>我的作业</el-menu-item>
  <el-menu-item index="/scratch/Course"><i class="el-icon-reading"></i>我的课程</el-menu-item>
  <el-menu-item index="/scratch/space"><i class="el-icon-s-order"></i>班级空间</el-menu-item>
  <el-submenu index="2">
    <template slot="title"><i class="el-icon-edit"></i>创作</template>
    <el-menu-item index="/scratch"><a href="https://scratch3.cocoet.cn/" target="_blank" class="linkout"><i class="el-icon-edit"></i>Scratch在线图形化编程</a></el-menu-item>
  </el-submenu>
  <span style="position: absolute;left: 75%;bottom:30%;font-weight: bold;color: rgb(155, 176, 234);">欢迎您！{{ messageForm.name }}</span>
  <el-dropdown @command="handleCommand">
    <div>
      <el-avatar :size="60">
        <el-upload
          class="avatar-uploader"
          action="/api/file/upload/head_image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-change="beforeAvatarUpload"
        :on-error="handelError"
        :disabled="firsthead"
        @click="lookimage()"
        >
          <el-image fit="scale-down" :preview-src-list="srclist" v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon">user</i>
      </el-upload>
      </el-avatar>

    </div>
      <el-dropdown-menu slot="dropdown" >
        <el-upload
            class="avatar-uploader"
            action="/api/file/upload/head_image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-change="beforeAvatarUpload"
            :on-error="handelError">
          <el-dropdown-item icon="el-icon-picture-outline-round">修改头像</el-dropdown-item>
        </el-upload>
        <el-dropdown-item icon="el-icon-switch-button" command="b">退出登录</el-dropdown-item>
        <el-dropdown-item icon="el-icon-setting" command="c">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-edit" command="d">查看信息</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
</el-menu></el-col>
    </el-header>
   <el-main>
    <el-drawer
        title="修改用户信息"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="updateForm">
          <el-form-item label="用户名" >
            <el-input v-model="updateForm.username" autocomplete="off" style="width:300px" placeholder="请输入要修改的用户名"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="updateForm.phoneNumber" autocomplete="off" style="width:300px" placeholder="请输入要修改的电话号码"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="用户信息" :visible.sync="message_show">
    <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
    <el-descriptions  :column="1" style="margin-top: 1%;margin-left: 2%">
      <el-descriptions-item label="用户名">{{messageForm.name}}</el-descriptions-item>
      <el-descriptions-item label="账号">{{messageForm.phoneNumber}}</el-descriptions-item>
<!--      <el-descriptions-item label="密码">{{messageForm.password}}</el-descriptions-item>-->
    </el-descriptions>
      <el-button style="margin-left: 10px" type="text" @click="update_message">修改信息</el-button>
      <el-button type="text" @click="set_input">教师认证</el-button>
    </div>
    </el-dialog>
     <el-dialog title="教师认证" :visible="show_input" @close="setdialog2">
       <el-form :model="code_S"  status-icon :rules="rules" ref="code_S" label-width="100px" class="demo-ruleForm">
         <el-form-item label="验证码" prop="code">
           <el-input v-model="code_S.code" ></el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="attestation">确认</el-button>
           <el-button type="primary" @click="resetForm('code_S')">重置</el-button>
         </el-form-item>
       </el-form>
     </el-dialog>
     <el-dialog title="修改密码" :visible="formshow" @close="setdialog">
     <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
       <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="确认密码" prop="checkpassword">
         <el-input type="password" v-model="ruleForm.checkpassword" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="update_password">确认修改</el-button>
         <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
       </el-form-item>
     </el-form>
     </el-dialog>
     <router-view></router-view></el-main>
   </div>
  </template>

  <script>
  export default{
    name:"Scratch",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkpassword !== '') {
            this.$refs.ruleForm.validateField('checkpassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        message_show:false,
        messageForm:{
        phoneNumber:'',
        name:''
      },
        code_S:{
          code:'',
        },
        show_input:false,
      updateForm:{
        username:'',
        phoneNumber:'',
      },
      dialog: false,
      loading: false,
        imageUrl:undefined,
        formshow:false,
        ruleForm:{
          password:'',
          checkpassword:'',
        },
        rules:{
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkpassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },
        firsthead:true,
        srclist:[]
      };
    },
    methods:{
      set_input(){
        this.show_input=true
      },
      setdialog2(){
        this.show_input=false
      },
      getmessage() {
      this.messageForm.phoneNumber = localStorage.getItem("phoneNumber")
      this.messageForm.password = localStorage.getItem("password")
      this.messageForm.name=localStorage.getItem('name')
    },
      lookimage(){
        this.$refs.previewImg.showViewer = true;
      },
      setdialog(){
        this.resetForm('ruleForm')
        this.formshow=false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      update_password(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let formdata3=new FormData()
            formdata3.append('password',this.ruleForm.password)
            this.postRequest('/homepage/update/password',formdata3).then(resp=>{
              if(resp.code===1){
                this.$message.success("修改密码成功！正在退出登录...")
                localStorage.clear()
                this.$router.replace('/')
              }else{
                this.$message.error(resp.error)
              }
            })
          } else {
            return false;
          }
        });
      },
      handleSelect(key, keyPath) {
       this.$router.push(key);
      },
      handleCommand(command) {
      if(command==='b'){
          //点击退出登录，跳转登陆页面
          window.sessionStorage.clear();
          this.$message.success("退出登录成功，正在跳转...");
          setTimeout(()=>{
            this.$router.replace('/');
          },3000)
      }else if(command==='c'){
        this.formshow=true;
      }else if(command==='d'){
        this.message_show=true
      }
    },
      handleAvatarSuccess(res, file) {
        this.imageUrl = file.raw
        let foemdata=new FormData()
        foemdata.append("image",this.imageUrl)
        this.postRequest('/file/upload/head_image',foemdata).then(resp=>{
          if(resp.code===1){
            this.getAvatar()
            this.firsthead=true
            window.sessionStorage.setItem('head_image',this.imageUrl)
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      beforeAvatarUpload(file) {
        this.imageUrl=URL.createObjectURL(file.raw)
      },
      handelError(err,file){
       this.$message.error("上传失败："+err)
      },
      getAvatar() {
        this.getRequest("http://localhost:8080/file/download/head_image",{},{responseType:"blob"}).then(resp=>{
            let blob;
            blob=new Blob([resp])
            this.imageUrl =window.URL.createObjectURL(blob)
            this.srclist[0]=this.imageUrl
            // console.log(this.imageUrl)
        }).catch(err => {
             this.$message.error(err)
            });
      },
      update_name(){
      let formdata1=new FormData()
      formdata1.append('username',this.updateForm.username)
      this.postRequest('/homepage/update/username',formdata1).then(resp=>{
          if(resp.code===1){
            setTimeout(() => {
              this.$message.success("修改用户名成功！正在退出登录...")
              localStorage.clear()
              this.$router.replace('/')
            }, 2000);
          }else{
            setTimeout(() => {
              this.$message.error(resp.msg)
            }, 2000);
          }
        })
    },
    update_phonenumber(){
      let formdata2=new FormData()
      formdata2.append('phoneNumber',this.updateForm.phoneNumber)
      this.postRequest('/homepage/update/phoneNumber',formdata2).then(resp=>{
        if(resp.code===1){
          setTimeout(() => {
            this.$message.success("修改电话号码成功！正在退出登录...")
            localStorage.clear()
            this.$router.replace('/')
          }, 2000);
        }else{
          setTimeout(() => {
            this.$message.error(resp.msg)
          }, 2000);
        }
      })
    },
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('确定要提交修改吗？')
          .then(_ => {
            if(this.updateForm.username!==''&&this.updateForm.phoneNumber===''){
              this.update_name()
            }else if(this.updateForm.username===''&&this.updateForm.phoneNumber!==''){
              this.update_phonenumber()
            }else if(this.updateForm.username!==''&&this.updateForm.phoneNumber!==''){
              this.update_name();
              this.update_phonenumber()
            }else{
              this.$message.error('修改内容不可为空！')
            }
            this.loading = true;
            this.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                this.loading = false;
              }, 400);
            }, 2000);
          })
          .catch(_ => {});
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    attestation() {
      this.$confirm('确认进行教师认证吗？')
          .then(()=> {
            let formdata=new FormData()
            formdata.append("code",this.code_S.code)
            this.postRequest('/homepage/setTeacherType',formdata).then(resp=>{
            if(resp.code===1){
              this.$message.success("教师认证成功！")
              localStorage.clear();
              this.$router.replace('/')
            }else{
              this.$message.error(resp.msg)
            }
          })
          }).catch(()=> {});
    },
    update_message(){
      this.dialog=true
    },
    },
    mounted() {
        this.getAvatar()
        this.getmessage()
    }
  }
  </script>

  <style lang="less" scoped>
  //.el-header{
  //  background-color: #2C8DF4;
  //}
  .avatar{
    margin-top: 7px;
  }
  .el-main{
    overflow: visible;
    height: 900px;
  }
  .linkout{
    color: #8f949a;
    text-decoration: none;
  }
  .linkout:hover{
    color:#000000;
  }

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 350px;
  margin: 0;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown{
  display: inline-block;
    position: absolute;
   font-size: 16px;
   top: 2px !important;
   left: 90%;

}
.el-icon-arrow-down {
  font-size: 12px;
}
.demo-drawer__content{
  margin-left: 10px;
}
  </style>
