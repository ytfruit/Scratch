<template>
<body>

<el-descriptions v-if="showhomework" border :column="1" v-for="(item,index) in setdata.slice((currentPage-1)*pageNumber,currentPage*pageNumber)" style="margin-top:10px">
  <el-descriptions-item label="题目集">{{item.title}}</el-descriptions-item>
  <el-descriptions-item label="教师">{{item.creater}}</el-descriptions-item>
  <el-descriptions-item label="发布时间">{{item.time_create}}</el-descriptions-item>
  <el-descriptions-item label="截止时间">{{item.time_endUp}}</el-descriptions-item>
  <el-descriptions-item label="序号">
    <el-tag size="max" :key="item.id_qs" @click="clicktag(item)">{{item.id_qs}}(点击查看题目)</el-tag>
    <!-- <el-tag size="max" :key="item.id_qs">时间已截止，无法查看</el-tag> -->
  </el-descriptions-item>
</el-descriptions>
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
<el-empty style="margin-top: 50px" description="您尚未加入班级" v-if="!showclass "></el-empty>
  <el-empty style="margin-top: 50px" description="教师未发布题目集" v-if="!showhomework "></el-empty>
</body>
</template>

<script>
import MyWork from "@/views/index/MyWork.vue";
export default{
  name:"HomeWork",
  data(){
    return {
      count:0,
      pageNumber:3,
      currentPage:1,//题目集分页处理
      title:'',//渲染题目集
      setdata:[],//题目集获取数据
      dialogVisable:false,//对话框打开
      id_qs:Number,//点击的题目集id
      id_q:[],//查询题目集后存储到的题目序号
      id_c:[],//查询题目集后存储到的班级
      showhomework:true,
      showclass:true
    }
},
  methods:{
    //改变页面展示数据量方法
    handleSizeChanged(val){
      this.pageNumber=val
    },
    //改变当前页面
    handleCurrentChange(val){
      this.show_q=false
      this.currentPage=val
    },
    //获取作业列表信息
    gethomework(){
      // let form = this.$refs['obj'].$el
      const formdata=new FormData();
      // this.phoneNumber=localStorage.getItem("phoneNumber")
      formdata.append("title",this.title)
      this.postRequest('/QuestionSet/select',formdata).then(resp=>{
        if(resp.code===1){
          this.setdata=resp.data;
          this.count=resp.data.length
          if(this.setdata.length===0){
            this.showhomework=false
          }
        }
        else{
          this.showclass=false
        }
      })
    },
    //点击题目集序号
    clicktag(item){
      this.dialogVisable=true;
      this.id_qs=item.id_qs;
      this.$store.commit('savetimeendUp',item.time_endUp)
      this.$store.commit('saveid_qs',this.id_qs)

      this.$router.replace('/scratch/MyWork')
      //MyWork.methods.getquestion()
      // this.getquestion();
      // console.log(this.$store.state.timeendUp)
    },
  },
  mounted() {
    this.gethomework();
  },
}
</script>

<style lang="less" scoped>
.font{
  font-size: 24px;
  font-family: 幼圆,serif;
}
.font2{
  font-size: 18px;
  font-family: 幼圆,serif;
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
  width: 480px;
}
</style>
