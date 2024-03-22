<template>
  <el-row>
    <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
      <el-table :data="score_stu" :row-key="row=>row.roleId" stripe style="width: 80%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'40px','line-height':'50px'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="id_homework" label="序号" width="150"></el-table-column>
        <el-table-column prop="belong_stu" label="学生" width="150"></el-table-column>
        <el-table-column fixed="right" label="作业文件" width="150">
          <template slot-scope="scope">
            <el-button size="mini"  @click="getfile(scope.$index, scope.row)"><i class="el-icon-download"></i></el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="setscore(scope.$index, scope.row)">批改</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="分数" width="200" prop="score">
          <template slot-scope="scope">
<!--            <el-button size="mini" v-if="success"  @click="lookscore(scope.$index, scope.row)">查看</el-button>-->
            <span v-if="!success">{{scope.row.score}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="scoreshow" title="批改分数" style="line-height: normal" @close="setdialogVisiable">
        <div class="block">
          <el-rate
              v-model="value"
              :colors="colors"
              show-score
              score-template="{value}"
              allow-half
              @change="score_g"
          >
          </el-rate>
          <el-button type="primary" @click="givescore" style="margin-top: 25px">提交分数</el-button>
          <el-button type="primary" @click="getclose" style="margin-top: 25px">重置</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name:'Score',
  data(){
    return{
      score_stu:[],
      scoreForm:{
        score:0,
        id_homework:0,
      },
      score_qs:0,
      score_q:0,
      score_homework:0,
      scratchFile:'',
      scoreshow:false,
      value: null,
      testScore:0,
      success:true,
      grade:[],
      id_stu:[],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    }
  },
  methods:{
    getclose(){
      this.value=0
    },
    setdialogVisiable(){
      this.scoreshow=false;
      this.value=0
    },
    setscore(index,row){
      this.scoreshow=true
      this.$store.commit('setid_homework',row.id_homework)
    },
    score_g(){
      this.value=this.value*20
      this.$store.commit('setgrade',this.value)
      // console.log(this.$store.state.grade)
    },
    givescore(){
      this.scoreForm.score=this.$store.state.grade
      this.scoreForm.id_homework=this.$store.state.id_homework
      this.postRequest('/homework/setScore',this.scoreForm).then(resp=>{
        if(resp.code===1){
          this.$message.success("评分完成！")
          this.getstu()
          this.setdialogVisiable()
        }else{
          this.$message.error(resp.msg)
        }
      })
    },
    async lookscore(index,row){
      this.score_qs=this.$store.state.id_qs
      this.score_q=this.$store.state.id_q
      let formdata=new FormData()
      formdata.append("id_qs",this.score_qs)
      formdata.append("id_q",this.score_q)
      for(let i=0;i<this.id_stu.length;i++){
        formdata.append("id_stu",this.id_stu[i])
      await this.postRequest('/homework/select/teacher',formdata).then(resp=>{
        if(resp.code===1 && resp.data.score!==-1){
          this.score_stu[i].score=resp.data.score
          this.success=false
        }else if(resp.code===1&&resp.data.score===-1){
          this.score_stu[i].score='还未批改，请批改'
          this.success=false
        }
      })
        formdata.delete("id_stu")
      }
      // console.log(this.grade[1])

    },
    getstu(){
      this.score_qs=this.$store.state.id_qs
      this.score_q=this.$store.state.id_q
      let formdata=new FormData()
      formdata.append("id_qs",this.score_qs)
      formdata.append("id_q",this.score_q)
      this.postRequest('/homework/select/QuestionSet',formdata).then(resp=>{
        if(resp.code===1){
          this.score_stu=resp.data
          for(let i=0;i<resp.data.length;i++){
            this.id_stu[i]=resp.data[i].belong_stu
          }
          // console.log(resp.data)
          // console.log(this.id_stu)
          this.score_stu=this.score_stu.map(item=>{
            return{
              score:'',
                  ...item
            }
          })
          this.lookscore();
          //console.log(this.score_stu)
          // console.log(this.grade)
          // for(let i=0;i<this.grade.length;i++){
          //   this.score_stu[i].score=this.grade[i]
          // }

          // console.log(this.grade[1])
          //console.log(this.score_stu)
        }else{
          this.$message.error(resp.msg)
        }
      })
    },
    getfile(index,row){
      this.score_homework=row.id_homework
      // let formdata=new FormData()
      // formdata.append("id_homework",this.score_homework)
      this.getRequest('/file/download/homework_teacher',{},{params:{id_homework:this.score_homework},responseType: 'blob'}).then(resp=>{
        if(resp.size!==0){
          let blob=new Blob([resp],{type: "application/octet-stream"})
          // console.log(blob)
          this.scratchFile=window.URL.createObjectURL(blob)
          // const filename=resp.headers["content-disposition"];
          // console.log(filename)
          const link = document.createElement('a');
          link.style.display='none'
          // link.download = filename;
          link.href = this.scratchFile;
          link.setAttribute('download',this.scratchFile+'.sb3')
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(link.href) //释放url
          document.body.removeChild(link) //释放标签
          window.open('https://scratch3.cocoet.cn/')
        }
      })
    }
  },
  mounted() {
    this.getstu()
  }
}
</script>

<style scoped lang="less">
/deep/ .el-rate__icon{
  font-size: 35px;
}
</style>
