<template>
  <el-row>
    <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
      <el-form :rules="rules" :model="updateForm" ref="updateForm">
        <el-form-item label="选择题目" prop="data" >
          <el-select @click.native="getoption" v-model="select_q" placeholder="请选择题目id" >
            <el-option v-for="item in questionoption" :label="item.id_q" :value="item.id_q">{{item.id_q}}</el-option>
          </el-select>
          <el-button  @click="add_q"  style="margin-left: 10px" type="primary">增加题目</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="update_q" :row-key="row=>row.row" stripe style="width: 70%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="id_q" label="题目ID" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini"  @click="setscore(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>


<script>
export default {
  name:'child2',
  props:{
    toChildVal:Number
  },
  data(){
    return{
      id_q:'',
      title:'',
      select_q:undefined,
      update_q:[],
      list_q:Object,
      questionoption:[],
      updateForm:{
        id_qs:this.toChildVal,
        data:undefined,
      },
      rules:{
        data:[{required: true, message: '请选择题目', trigger: 'change'}],
      }
    }
  },
  methods:{
    getoption(){
      this.updateForm.data=this.select_q;
      let formdata = new FormData();
      formdata.append("title", this.title)
      this.postRequest('/Question/select_bytitle', formdata).then(resp => {
        if (resp) {
          // console.log(resp);
          //展示题目选项
          this.questionoption=resp.data;
        } else {
          this.$message.error(resp.msg)
        }
      })
    },
    async getquestion(){
      let formdata=new FormData();
      formdata.append("id_qs",this.toChildVal)
      this.postRequest('/QuestionSet/select/detail',formdata).then(resp=>{
            this.update_q=resp.data.question.map(item=>{
              return {id_q:item}
              })
      })
    },
    setscore(index,row){
      console.log(row.id_q)
      this.$store.commit('saveid_q',row.id_q)
      this.$router.push('/teachers/score')
    },
    add_q(){
      this.updateForm.data=this.select_q
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          this.postRequest('/QuestionSet/update/question/add', this.updateForm).then(resp => {
            if (resp.code === 1) {
              this.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success'
              })
              this.getquestion();
            } else {
              this.$message.error(resp.msg)
            }
          })
        }
      })
    },
   async handleDelete(index, row) {
      // this.updateForm.data=this.select_q;
     // console.log(row.id_q)
      this.updateForm.data=row.id_q
      this.$confirm("确定删除该题目吗？", "删除提示", {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => { //确认删除
        this.postRequest('/QuestionSet/update/question/remove',this.updateForm).then(resp=>{
          if (resp.code===1) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            this.getquestion()
          }
          else{
            this.$message.error(resp.msg)
          }
        })
    }).catch(() => {

      })
  },
  },
  mounted() {
    this.getquestion()
    // this.getoption()
  },
}

</script>



<style scoped lang="less">

</style>
