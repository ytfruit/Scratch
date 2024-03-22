<template>
    <body>
        <div class="child3">
          <el-card class="box-card" v-for="(item,index) in questionlist.slice((currentPage-1)*pageNumber,currentPage*pageNumber)" style="margin-top: 5px">
            <div slot="header" class="clearfix">
              <span>{{"题目集名称："+" "+item.title}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" class="el-icon-arrow-down" @click="showcard(index)"></el-button>
            </div>
            <div  class="text item" >
              <p>{{"创建时间："+item.time_create}}</p>
              <p>{{"截止时间："+item.time_endUp}}</p>
              <p>{{"教师："+item.creater}}</p>
              <el-tag type="info">{{"备注："+item.id_qs}}</el-tag>
            </div>
          </el-card>
          <div style="margin-top:10px;margin-left: 20%">
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
        </div>
    </body>
</template>

<script>
  import TClass from "@/views/Teachers/Class/TClass.vue";
  import event from '@/utils/event'
  export default{
    name:"child3",
    props:{
      toChildVal:Number,
    },
    data(){
        return{
          click:0,
          count:0,
          pageNumber:3,
          currentPage:1,
          questionlist:[],
          cardshow:false
        }
    },
    methods:{
      //改变页面展示数据量方法
      handleSizeChanged(val){
        this.pageSize=val
        this.lookquestion();
      },
      //改变当前页面
      handleCurrentChange(val){
        this.currentPage=val
        this.lookquestion()
      },
      showcard(){
        this.click++;
        this.cardshow = this.click % 2 !== 0;
      },
        lookquestion(){
          let formdata=new FormData()
          formdata.append("id_c",this.toChildVal)
          this.postRequest('/Class/select/QuestionSet',formdata).then(resp=>{
            if(resp){
              this.questionlist=resp.data
              this.count=resp.data.length
            }
          })
        },
    },
    mounted() {
      this.lookquestion();
    }
  }
</script>

<style lang="less" scoped>
.question{
    border-radius: 5px;
     cursor: pointer;
     background-color:#9acdc5;
     height: 15vh;
     width:100%;
     margin-top: 15px;
     font-size: 20px;
     font-family: '幼圆',serif;
}
   .question:hover{
    background-color:#409EFF
   }
</style>
