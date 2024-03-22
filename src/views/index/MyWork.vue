<template>
  <body>
  <div v-cloak>
  <el-descriptions direction="vertical" :column="4" border style="height: 300px" v-for="(item,index) in question.slice((currentPage_q-1)*pageNumber_q,currentPage_q*pageNumber_q)">
    <el-descriptions-item>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          {{"题目："+item.title}}
          <el-button type="primary" @click="do_homework" style="margin-left: 70%">去做作业</el-button>
        </div>
        <div  class="text item">
          {{"题目介绍："+item.question}}
        </div>
        <div>
        <el-upload
            v-show="canupload"
            style="position: relative;left:80%"
            :auto-upload="false"
            action=""
            :on-change="(file)=>{upload(file)}"
            :disabled="item.disabled"
            :on-error="handelError"
        >
        <el-tag type="info" v-show="item.homework!==''">已上传</el-tag>
          <el-tag class="el-icon-upload" type="info" @click="getitem(item.id_q)" v-show="item.homework===''">点击上传作业{{ item.id_q }}</el-tag>
        </el-upload>
        <el-upload
        v-if="canupload"
            style="position: relative;left:80%"
            :auto-upload="false"
            action=""
            :on-change="(file)=>{upload2(file)}"
            v-show="item.disabled"
            :on-error="handelError"
        >
        <el-button style="margin-left: 2px;" type="text" @click="getitem2(item.id_q,index)" v-show="item.homework!==''">重新上传</el-button>
        </el-upload>
          分数：<span style="font-size:24px;color: #9a2a2a" v-cloak>{{item.grade}}</span>
          <el-tag style="margin-left: 60%;" v-show="!canupload" v-cloak>作业已截止，无法上传</el-tag>
        </div>
      </el-card>
    </el-descriptions-item>
  </el-descriptions>
  <div style="margin-top:10px;margin-left: 20%">
    <el-pagination
        @size-change="handleSizeChanged_q"
        @current-change="handleCurrentChange_q"
        background
        :current-page="currentPage_q"
        :page-size="pageNumber_q"
        layout="prev, pager, next"
        :total="count_q">
    </el-pagination>
  </div>
  </div>
  </body>
</template>

<script>
import { MenuItem } from 'element-ui';
import {mapState} from "vuex";

export default {
  name:'MyWork',
  data(){
    return{
      isDisabled:false,
      id_qs:1,//bus传来的题目集序号
      count_q:0,
      pageNumber_q:2,//题目列表分页列表
      currentPage_q:1,
      id_q:[],//查询题目集后存储到的题目序号
      question:[],//题目详情的数组对象
      questionData:Object,//具体题目
      show_q:false,//题目是否显示
      scratchUrl:'',
      scratch_q:[],
      scratch_qs:'',
      filelist:[],
      homework:'',
      grade:[],
      getshow:true,
      timeendUp:'',
      nowtime:'',
      canupload:true,
      obj:{}
    }
  },
  methods:{
    getitem(item){
      this.$store.commit('saveid_q',item)
    },
    getitem2(item,index){
      this.$store.commit('saveid_q',item)
    },
    // handleRemove(index) {
    //   // console.log(index)
    //   this.$confirm(`确定移除作业文件？`,{
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     })
    //       .then(() => {
    //           this.question[index].filelist.pop()
    //           this.question[index].homework=''
    //           this.question[index].disabled=false
    //            console.log("2",this.question)
    //            this.$store.commit('savequestion',this.question)
    //           // this.getfile()
    //           this.$$forceUpdate()

    //       })
    //       .catch(() => { })
    // },
    upload(file){
      this.scratchUrl=file.raw
      // console.log(file)
      this.scratch_q=this.$store.state.id_q
      this.scratch_qs=this.$store.state.id_qs
      let formdata= new FormData()
      formdata.append("id_questionset",this.scratch_qs)
      formdata.append("id_question",this.scratch_q)
      formdata.append("homework",this.scratchUrl)
      this.postRequest('http://localhost:8080/file/upload/homework',formdata).then(resp=>{
        if(resp.code===1){
          this.$message.success('上传作业成功！')
          //
          location.reload()
          // this.fileList.push(file)
          this.isDisabled=true
          this.getfile()
          this.getscore()
        }else{
          this.$message.error(resp.msg)
        }
      })
    },
    upload2(file){
      this.scratchUrl=file.raw
      // console.log(file)
      this.scratch_q=this.$store.state.id_q
      this.scratch_qs=this.$store.state.id_qs
      let formdata= new FormData()
      formdata.append("id_questionset",this.scratch_qs)
      formdata.append("id_question",this.scratch_q)
      formdata.append("homework",this.scratchUrl)
      this.postRequest('http://localhost:8080/file/upload/homework',formdata).then(resp=>{
        if(resp.code===1){
          this.$message.success('重新上传作业成功！')
          // this.fileList.push(file)
          this.isDisabled=true
          location.reload()
          this.getfile()
          this.getscore()
        }else{
          this.$message.error(resp.msg)
        }
      })
    },
   async getfile(){
     // this.question=this.$store.state.question
      this.scratch_q=this.id_q
      this.scratch_qs=this.$store.state.id_qs
      // console.log(this.id_section)
      // let formdata=new FormData()
      // formdata.append("id_section",this.id_section)
      // const params = new URLSearchParams(formdata)
      // console.log(this.id_section)
      for(let i=0;i<this.id_q.length;i++){
        await this.getRequest('http://localhost:8080/file/download/homework',{},{params:{id_question:this.scratch_q[i],id_questionset:this.scratch_qs},responseType: 'blob'}).then(resp => {
        if (resp.size!==0) {
          // console.log(resp)
          let blob=new Blob([resp],{type: "application/octet-stream"})
          this.scratchUrl=window.URL.createObjectURL(blob)
          // this.question[i].filelist.push(resp)
          // console.log(this.scratchUrl)
          this.isDisabled=true
          // this.videoflag = false
        }else if(resp.size===0){
          this.scratchUrl=''
          // this.filelist.pop()
          this.isDisabled = false
          // console.log(this.isDisabled)
        }
        this.question[i].homework=this.scratchUrl
        this.question[i].disabled=this.isDisabled
          //this.$store.state.question=this.question
        // console.log(this.question)
      })

      }

      // console.log("1:",this.question)
    },
    handelError(err,file){
      this.$message.error("上传失败："+err)
    },
    handleSizeChanged_q(val){
      this.pageNumber_q=val
    },
    handleCurrentChange_q(val){
      //this.show_q=false
      this.currentPage_q=val
      // this.filelist.pop()
      // this.scratchUrl=''
      // this.filelist.pop()
    },
    //点击题目序号
    // clicktag_q(item){
    //   let formdata=new FormData()
    //   formdata.append("id_q",item)
    //   this.postRequest('/Question/select',formdata).then(resp=>{
    //     if(resp.code===1 && item===resp.data.id_q){
    //       this.show_q=true
    //       this.questionData=resp.data
    //       // console.log(this.questionData)
    //     }else{
    //       this.$message.error(resp.msg)
    //     }
    //   })
    //  this.$store.commit('saveid_q',item)
    //   this.getfile()
    //   this.getscore()
    //   // console.log("题目序号："+this.$store.state.id_q)
    //   // console.log("题目集序号："+this.$store.state.id_qs)
    // },
    //获取题目
     getquestion(){
      this.id_qs=this.$store.state.id_qs
      let formdata=new FormData();
      formdata.append("id_qs",this.id_qs)
      this.postRequest('/QuestionSet/select/detail2',formdata).then(resp=>{
        if(resp.code===1){
          // console.log(resp.data)
          this.question=resp.data.question
         // console.log(this.question)
          this.question=this.question.map((item,index)=>{
            return{
              homework:'',
              disabled:false,
              grade:'',
              ...item
            }
          })
          //this.$store.state.question=this.question
          //  console.log(this.question)
          for(let i=0;i<resp.data.question.length;i++){
            this.id_q[i]=resp.data.question[i].id_q
            //console.log(this.id_q[i])
          }
          //this.$store.commit('saveid_Q',this.id_q)
          this.count_q=resp.data.question.length
          //this.$store.commit('savequestion',this.question)
          this.getfile()
          this.getscore()
          //this.$store.commit('savequestion',this.question)
           //console.log(this.question)
        }else{
          this.$message.error(resp.msg)
        }
      })
    },
    //跳转做作业页面
    do_homework(){
      window.open('https://scratch3.cocoet.cn/')
    },
    //获取分数
    async getscore(){
     // this.question=this.$store.state.question
      this.scratch_q=this.id_q
      this.scratch_qs=this.$store.state.id_qs
      let formdata=new FormData()
       formdata.append("id_qs",this.scratch_qs)
      for(let i=0;i<this.scratch_q.length;i++){
        formdata.append("id_q",this.scratch_q[i]);
        await this.postRequest('/homework/select/stu',formdata).then(resp=>{
        if(resp.code===1 && resp.data.score!==-1){
          this.question[i].grade=resp.data.score
         // this.getshow=false
        }else if(resp.code===0){
          this.question[i].grade='未提交作业'
        }else if(resp.code===1&&resp.data.score===-1){
          this.question[i].grade='教师未批阅'
        }
         // this.$store.state.question=this.question
      })
      formdata.delete("id_q")
      }
      //  this.$store.commit('savequestion',this.question)
      // console.log(this.grade)
    },
    gettime(){
      var _this = this;
    　　let yy = new Date().getFullYear();
    　　let mm = new Date().getMonth()+1;
    　　let dd = new Date().getDate();
    　　let hh = new Date().getHours();
    　　let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
    　　let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
    　　_this.nowtime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    this.nowtime=new Date(this.nowtime)
    }
  },
  created() {
    this.getquestion()
    //this.question=this.$store.state.question
    // this.$forceUpdate()
    //this.question=this.$store.state.question
    this.timeendUp=this.$store.state.timeendUp
    this.gettime()
    this.timeendUp=new Date(this.timeendUp)
    //console.log('截止时间：',this.timeendUp)
    //console.log('现在时间：',this.nowtime)
    //console.log(this.question)
    if(this.nowtime<this.timeendUp){
      this.canupload=true
    }else if(this.nowtime>=this.timeendUp){
      this.canupload=false
    }
   // console.log(this.canupload)
  },
  // mounted() {
  //   console.log(this.question)
  // }
}

</script>

<style lang="less" >
[v-cloak]{
  display: none !important;
}
</style>
