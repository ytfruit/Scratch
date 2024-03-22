<template>
    <body>
      <el-container class="firstContainer">
      <el-header style="line-height: 60px;overflow: visible;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
          <div style="height:50px; width: 50px;"><span><img src="../../assets/logo1.png"></span></div>
            <el-button @click="toggleCollapse" style="position: absolute;left: 22%;top: 2%;"><i class="el-icon-s-fold"></i></el-button>
            <span style="position: absolute;left: 75%;top:1%;font-weight: bold;color: rgb(155, 176, 234);">欢迎您！{{ messageForm.name }}</span>
          <el-dropdown @command="handleCommand" style="position: absolute;left: 85%;top: 0;font-size: 18px;font-family: '幼圆';">
            <el-avatar :size="60" shape="circle" >
              <el-upload
                  class="avatar-uploader"
                  action="http://localhost:8080/file/upload/head_image"
                  :show-file-list="false"
                  :on-change="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                  :on-error="handelError"
                  :disabled="firsthead"
              >
                <el-image :preview-src-list="srclist" fit="scale-down" v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon">user</i>
              </el-upload>
            </el-avatar>
    <el-dropdown-menu slot="dropdown">
      <el-upload
          class="avatar-uploader"
          action="/api/file/upload/head_image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-change="beforeAvatarUpload"
          :on-error="handelError">
        <el-dropdown-item icon="el-icon-picture-outline-round">修改头像</el-dropdown-item>
      </el-upload>
      <el-dropdown-item command="b" icon="el-icon-switch-button">退出登录</el-dropdown-item>
      <el-dropdown-item command="c" icon="el-icon-setting">密码修改</el-dropdown-item>
       <el-dropdown-item command="d" icon="el-icon-edit">查看信息</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

      </el-header>
      <el-container>
    <el-col :span="isCollapse ? 1 : 3">
    <el-aside>
      <el-menu :default-active="this.$route.path"  class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse" router style="height:100%;">
    <el-menu-item index="/teachers/video"><i class="el-icon-s-order"></i><span slot="title">课程管理</span></el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-document"></i><span slot="title">作业管理</span></template>
      <el-menu-item index="/teachers/thomework"><span slot="title">作业管理</span></el-menu-item>
      <el-menu-item index="/teachers/question" ><span slot="title">题库</span></el-menu-item>
    </el-submenu>
    <el-menu-item index="/teachers/tclass"><i class="el-icon-notebook-1"></i><span slot="title">班级管理</span></el-menu-item>
    <el-menu-item index="/teachers/studentsmessage"><i class="el-icon-s-check"></i><span slot="title">学生用户管理</span></el-menu-item>
      <!-- <el-menu-item v-for="(item) in menuList" :key="item.status" :index="item.path"><i class="[item.icon]"></i><span slot="title">{{ item.label }}</span></el-menu-item> -->
  </el-menu>
  </el-aside>
  </el-col>
  <el-col :span="isCollapse ?23:21">
    <el-main>
      <el-dialog title="用户信息" :visible.sync="message_show" style="line-height: normal;">
    <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
    <el-descriptions  :column="1" style="margin-top: 1%;margin-left: 2%">
      <el-descriptions-item label="用户名">{{messageForm.name}}</el-descriptions-item>
      <el-descriptions-item label="账号">{{messageForm.phoneNumber}}</el-descriptions-item>
<!--      <el-descriptions-item label="密码">{{messageForm.password}}</el-descriptions-item>-->
<!--      <el-descriptions-item>-->

<!--      </el-descriptions-item>-->
    </el-descriptions>
      <el-button style="margin-left: 15px" type="text" @click="update_message">修改信息</el-button>
    </div>
    </el-dialog>
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
    <router-view></router-view>
    </el-main>
  </el-col>
  </el-container>
  </el-container>
  </body>
  </template>

    <script>
    export default{
      name:"Teachers",

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
          dialog: false,
      loading: false,
          formshow:false,
          ruleForm:{
            password:'',
            checkpassword:'',
          },
          message_show:false,
          messageForm:{
        phoneNumber:'',
        name:''
      },
          updateForm:{
        username:'',
        phoneNumber:'',
      },
          rules:{
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkpassword: [
              { validator: validatePass2, trigger: 'blur' }
            ],
          },
          restaurants: [],
          state: '',
          isshow:false,//搜索按钮
          isCollapse: false,//导航菜单
          imageUrl:undefined,
          firsthead:true,
          //导航路由
          // menuList:[
          //   {label:'课程管理',path:"/teachers/video",status:0,icon:'el-icon-s-order'},
          //   {label:'作业管理',path:"/teachers/thomework",status:1,icon:'el-icon-document'},
          //   {label:'班级管理',path:"/teachers/tclass",status:2,icon:'el-icon-notebook-1'},
          //   {label:'学生用户管理',path:"/teachers/studentsmessage",status:3,icon:'el-icon-s-check'},
          // ],
          srclist:[]
        }
    },
    methods:{
      update_message(){
      this.dialog=true
    },
      getmessage() {
      this.messageForm.phoneNumber = localStorage.getItem("phoneNumber")
      this.messageForm.password = localStorage.getItem("password")
      this.messageForm.name=localStorage.getItem('name')
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
      update_password(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let formdata3=new FormData()
            formdata3.append('password',this.ruleForm.password)
            this.postRequest('/homepage/update/password',formdata3).then(resp=>{
              if(resp.code===1){
                this.$message.success("修改密码成功！")
                localStorage.setItem('password',this.ruleForm.password)
                // this.formshow=false;
                this.setdialog()
                // localStorage.clear()
                // this.$router.replace('/')
              }else{
                this.$message.error(resp.error)
              }
            })
          } else {
            return false;
          }
        });
      },
      setdialog(){
        this.resetForm('ruleForm')
        this.formshow=false
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      search(){
       this.isshow=true;
       this.$nextTick(() => {
        this.$refs.input.focus()//控制焦点
      })
      },
      textarea(){
        this.isshow=false;
      },
      handleCommand(command) {
          if(command==='b'){
            this.off()
          }else if(command==='c'){
            this.formshow=true
          }else if(command==='d'){
            this.message_show=true
          }
        },
      off(){
        localStorage.clear();
        this.$message.success("退出登录成功，正在跳转...");
        setTimeout(()=>{
          this.$router.replace('/');
        },3000)
      },
      toggleCollapse(){
        this.isCollapse=!this.isCollapse;
      },
      querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
      createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
      loadAll(){
          return[
            {"value":"课程管理","path":"/teachers/video"},
            {"value":"作业管理","path":"/teachers/thomework"},
            {"value":"班级管理","path":"/teachers/tclass"},
            {"value":"学生用户管理","path":"/teachers/students"},
          ];
        },
        handleSelect(key, keyPath) {
         this.$router.push(key);
        },
      handleAvatarSuccess(res, file) {
        this.imageUrl = file.raw
        // console.log(this.imageUrl)
        let foemdata=new FormData()
        foemdata.append("image",this.imageUrl)
        this.postRequest('http://localhost:8080/file/upload/head_image',foemdata).then(resp=>{
          if(resp.code===1){
            this.$message.success('上传头像成功！')
            this.firsthead=true
            this.getAvatar()
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
        this.getRequest('http://localhost:8080/file/download/head_image',{},{responseType:"blob"}).then(resp=>{
          if(resp){
            let blob;
            blob=new Blob([resp])
            this.imageUrl =URL.createObjectURL(blob)
            this.srclist[0]=this.imageUrl
            // console.log(blob)
          }else{
            this.$message.error("回显头像失败，联系管理员查看原因")
          }
        }).catch(err => {
          this.$message.error(err)
        });
      }
      },
      mounted() {
        //加载特效
        this.restaurants = this.loadAll();
        this.getAvatar()
        this.getmessage()
      }
    };
    </script>

  <style lang="less" scoped>
  .demo-drawer__content{
  margin-left: 10px;
}
  .avatar{
    margin-top: 7px;
  }
  .firstContainer{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
   .linkout{
      color: #8f949a;
      text-decoration: none;
    }
    .linkout:hover{
      color:#000000;
    }
  .body{
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: visible;
  }
  .el-main{
      // text-align: center;
      //line-height: 160px;
      width: 100%;
      height: 100%;
      overflow-y: visible;
    overflow-x: visible;
  }
  .el-aside {
    text-align: center;
    line-height: 200px;
    height: 100%;
    overflow: visible;
    margin-top: 1%;
    //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  body > .el-container {
      margin-bottom: 40px;
    }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
      line-height: 260px;
    }
  .el-container:nth-child(7) .el-aside {
      line-height: 320px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
  .head{
      margin-top: 20px;
    }
  .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      position: relative;
    }
  .el-col {
      border-radius: 4px;
    }
  .el-dropdown-link {
      cursor: pointer;
      color: #4e4b4b;
    }
  .el-icon-arrow-down {
      font-size: 12px;
    }
  .grid-content {
      border-radius: 4px;
      min-height: 36px;
      height: 50px;
    }
  .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;
  .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }

    }
  }
    </style>
