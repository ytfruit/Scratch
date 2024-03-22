<template>
  <body>

  <div style="margin-top:5px;margin-left: 0.5%">
    <el-pagination
        @size-change="handleSizeChanged"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-size="pageNumber"
        layout="prev, pager, next"
        :total="count">
    </el-pagination>
  </div>
  <el-row>
      <el-col :span="8" v-for="item in courseForm">
<!--    <div class="wrap">-->
<!--     <div class="course"  >-->
<!--       <div style="width:100%;height:60%;overflow: visible">-->
<!--         <el-image fit="contain" :src="item.image"></el-image>-->
<!--       </div>-->
<!--       <p style="text-align: center">{{item.title}}</p>-->
<!--       课程介绍：<span style="margin-left: 5px;font-size: 12px">{{item.description}}</span>-->
<!--       <p>教师：{{item.creater}}</p>-->
<!--&lt;!&ndash;       <span style="margin-left: 5px">发放时间：{{item.time_create}}</span>&ndash;&gt;-->
<!--       <i class="el-icon-arrow-right" style="position:relative;top:30%;left:45%"></i>-->
<!--     </div>-->
<!--    </div>-->
  <el-card class="box-card" v-if="showcourse" @click.native="lookcourse(item.id_course)" >
    <div slot="header" class="clearfix">
      <span style="font-weight: bold;font-size: 18px">{{item.title}}</span>
<!--      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
    </div>
    <div  class="text item">
      <span style="color: white">{{"课程介绍："+item.description}}</span>
    </div>
    <p style="color: white">教师：{{item.creater}}</p>
    <p style="color: white">发放时间：{{item.time_create}}</p>
    <i class="el-icon-arrow-right" style="position:relative;top:30%;left:80%"></i>
  </el-card>
    </el-col>
  </el-row>
  <el-empty style="margin-top: 50px" description="您尚未加入班级" v-if="!showclass "></el-empty>
    <el-empty style="margin-top: 50px" description="教师未创建课程" v-if="!showcourse "></el-empty>
  </body>
</template>

<script>
import bg2 from '@/assets/course_img/course2.webp'
import bg3 from '@/assets/course_img/course3.webp'
import bg4 from '@/assets/course_img/course4.jpg'
import bg5 from '@/assets/course_img/course5.webp'
import bg6 from '@/assets/course_img/course6.png'

  export default{
    name:"Course",
    data(){
      return{
        courseForm:[],
        count:0,
        pageNumber:3,
        currentPage:1,//题目集分页处理
        section_c:{},
        id_course:0,
        image_path:[bg2,bg3,bg4,bg5,bg6],
        pic:'',
        showcourse:true,
        showclass:true,
      }
    },
    methods:{
      getcourse(){
        this.postRequest('Course/select').then(resp=>{
          if(resp.code===1){
            // console.log(resp)
            let index=Math.round(Math.random()*4)
            this.pic=this.image_path[index]
            this.courseForm=resp.data
            this.section_c=resp.data[0].belong_section
            this.id_course=resp.data[0].id_course
            //this.$store.commit('saveid_course',this.id_course)
            this.$store.commit('savesetion_c',this.section_c)
            this.courseForm=this.courseForm.map(item=>{
              return{
                image:'',
                ...item
              }
            })
            for(let i=0;i<this.courseForm.length;i++){
                this.courseForm[i].image=this.pic
            }
            if(this.courseForm.length===0){
              this.showcourse=false
            }
          //console.log(this.courseForm)
            // console.log(this.section_c)
            //console.log(this.id_course)
          }else{
            this.showclass=false
          }
        })
      },
      lookcourse(item){
        this.$store.commit('saveid_course',item)
        //console.log(this.$store.state.id_course)
        this.$router.replace('/scratch/section_c')
        this.$forceUpdate()
      },
      //改变页面展示数据量方法
      handleSizeChanged(val){
        this.pageNumber=val
      },
      //改变当前页面
      handleCurrentChange(val){
        this.show_q=false
        this.currentPage=val
      },
    },
    mounted() {
      this.getcourse()
    },
    created() {
      let index=Math.round(Math.random()*4)
      this.pic=this.image_path[index]
      //console.log(this.pic)
    }
  }
</script>

<style lang="less" scoped>
.course{
  //background-color: #9a2a2a;
  margin-left: 5px;
  margin-top: 10px;
  height: 250px;
  width:300px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow-y: auto;
  /* 注意是border-box盒模型 */
  box-sizing: border-box;
}
.course:hover{
  background-color: #ced3da;
}
.wrap {
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 6px;
  /* 开启弹性盒，换行，两端分布 */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* 解决最后一行不从左往右排布问题 */
.wrap::after {
  content: "";
  /* 和内容项的宽度保持一致 */
  height: 0;
  width: 300px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 400px;
  margin-top: 15px;
  border-radius: 10px;
  background-image: url("@/assets/pictrue.jpg");
  background-size:contain;
  background-position:  center;
  background-repeat: no-repeat;

}
.box-card:hover{
  background-color: #837d7d;
}
</style>
