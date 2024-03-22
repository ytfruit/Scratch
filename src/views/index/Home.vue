<template>
  <el-main>
    <el-row :gutter="20" type="flex">
<el-col>
    <el-dialog :visible.sync="message_show">
    <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
    <el-descriptions title="用户信息" :column="1" style="margin-top: 1%;margin-left: 2%">
      <el-descriptions-item label="用户名">{{messageForm.name}}</el-descriptions-item>
      <el-descriptions-item label="账号">{{messageForm.phoneNumber}}</el-descriptions-item>
      <el-descriptions-item label="密码">{{messageForm.password}}</el-descriptions-item>
      <el-descriptions-item>
        <el-button type="text" @click="update_message">修改信息</el-button>
        <el-button type="text" @click="attestation">教师认证</el-button>
      </el-descriptions-item>
    </el-descriptions>
    </div>
    </el-dialog>
  </el-col>
  </el-row>
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
  </el-main> 
</template>

<script>
 export default{
  name:"Home",
  data() {
    return {
      imgs:[
          {id:0,url:require('@/assets/imgs/img1.png')},
          {id:1,url:require('@/assets/imgs/img2.jpg')},
          {id:2,url:require('@/assets/imgs/img3.jpg')},
          {id:3,url:require('@/assets/imgs/img4.jpg')}
      ],
      message_show:false,
      code:String,
      messageForm:{
        phoneNumber:'',
        name:''
      },
      updateForm:{
        username:'',
        phoneNumber:'',
      },
      dialog: false,
      loading: false,
    };
  },
  methods: {
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
    message() {
      this.message_show = true;
    },
    class_space() {
      this.$router.replace('/scratch/space');
    },
    attestation() {
      this.$confirm('确认进行教师认证吗？')
          .then(()=> {
            this.code='teacher'+this.messageForm.phoneNumber
            let formdata=new FormData()
            formdata.append("code",this.code)
            this.postRequest('/homepage/setTeacherType',formdata).then(resp=>{
            if(resp.code===1){
              this.$message.success("教师认证成功！")
              localStorage.clear();
              this.$router.replace('/')
            }
          })
          }).catch(()=> {});
    },
    update_message(){
      this.dialog=true
    },
    getmessage() {
      this.messageForm.phoneNumber = localStorage.getItem("phoneNumber")
      this.messageForm.password = localStorage.getItem("password")
      this.messageForm.name=localStorage.getItem('name')
    },
  },
   mounted() {
    this.getmessage()
   }
 }
</script>

<style lang="less" scoped>
.d2 {
   min-width: 100%;
    height: 40px;
    position: relative;
    display:flex;
    justify-content:flex-end;
    top:80%;
}
.span1{
  font-size: 24px;
  font-weight: bold;
   position:absolute;
   left: 78%;
   top:73%;
   color: #676363;
}
.el-main{
  overflow: visible;
}
.el-carousel__item:nth-child(2n) {
   height: 100%;
   border-radius: 15px;
}

.el-carousel__item:nth-child(2n+1) {
   height: 100%;
   border-radius: 15px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 10px;
}

.grid-content {
  margin: 0;
  overflow: visible;
  border-radius: 10px;
  min-height: 100px;
  height: 450px;
  background-image: url(../../assets/homebg2.webp);
  background-size: 100% 100%;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.demo-drawer__content{
  margin-left: 10px;
}
</style>
