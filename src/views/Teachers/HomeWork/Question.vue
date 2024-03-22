<template>
   <body>
    <!-- <el-row>
    <el-col :span="12" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;">
    <el-form>
    <el-form-item>
        <el-button type="primary" @click="createquestion">创建题目</el-button>
    </el-form-item>
    </el-form>
    </el-col>
    </el-row> -->
    <div style="display: flex;margin-top: 20px;">
    <!--渲染表格-->
    <div style="flex: 1;margin-right: 10px;">
    <el-row>
    <el-col :span="24" style="height: 600px;margin-top: auto;margin-left: 15px;">
    <el-table class="tables" :row-key="({roleId})=>roleId" :data="questionData"  border max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column fixed prop="id_q" label="题目序号" width="80"></el-table-column>
    <el-table-column prop="title" label="作业题目" width="200"></el-table-column>
    <el-table-column prop="question" label="详细内容" width="250"></el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    </el-col>
    </el-row>
    </div>
    <!--修改对话框-->
    <el-dialog title="修改题目" :visible.sync="dialogVisiable" @close="setdialogVisiable('updateForm')" width="50%" style="border-radius: 30px;">
     <div style="height: 200px;margin: 0;padding: 0;">
      <el-form :model="updateForm" ref="updateForm" label-width="150px" class="demo-ruleForm">
      <el-form-item  label="作业题目(选填）" prop="title">
        <el-input type="textarea" resize="none" v-model="updateForm.title" placeholder="请输入要修改的作业题目" :rows="1"></el-input>
      </el-form-item>
      <el-form-item  label="详细内容（选填）" prop="question">
        <el-input type="textarea" resize="none" v-model="updateForm.question" placeholder="请输入要修改的详细内容" :rows="2"></el-input>
      </el-form-item>
      <!-- <el-form-item label="上传作业文件" prop="" >
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="updatehomework">修改</el-button>
        <el-button @click="resetForm('updateForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </el-dialog>
  <!--创建题目表单-->
    <div style="height: 400px;flex: 1;margin-left: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
    <el-row style="margin-top: 20px; margin-left: 15px;">
    <el-col>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="作业题目" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入作业题目" style="width: 70%;"></el-input>
      </el-form-item>
      <el-form-item label="详细内容" prop="question">
      <el-input type="textarea" v-model="ruleForm.question" placeholder="请输入题目详细内容" :rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createquestion">创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      </el-form>
    </el-col>
    </el-row>
    </div>
    </div>
   </body>
  </template>

  <script>
  export default{
    name:"Question",
    data(){
        return{
          title:'',
          id_q:'',
          dialogVisiable:false,
          ruleForm:{
            title:'',
            question:'',
          },
          updateForm:{
            id_q:undefined,
            title:'',
            question:''
          },
          // update_titleForm:{
          //   id_qs:undefined,
          //   title:'',
          // },
          // update_questionForm:{
          //   id_qs:undefined,
          //   question:'',
          // },
          rules:{
            question: [{ required: true, message: '请输入题目详细内容', trigger: 'blur' }]
          },
          questionData:[],
        }
    },
    methods:{
      //表格渲染题目
     inittableData(){
        let formdata=new FormData();
        formdata.append("title",this.title)
         this.postRequest('/Question/select_bytitle',formdata).then(resp=>{
          if(resp.code===1){
            this.questionData=resp.data;
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      //创建题目
         createquestion(){
          this.$refs.ruleForm.validate(async (valid) => {
            if (valid) {
               this.postRequest('/Question/create', this.ruleForm).then(resp => {
                if (resp) {
                  this.inittableData();
                  // window.location.reload()
                  console.log(resp)
                  this.$message.success("创建成功");
                } else {
                  this.$message.error(resp.msg)
                }
              })
            } else {
              console.log('error create!');
              return false;
            }
          });
        },
        //重置题目信息
      resetForm(forName) {
        this.$refs[forName].resetFields();
      },
      setdialogVisiable(forName){
        //关闭嵌套表单
        this.dialogVisiable=false;
        this.$refs[forName].resetFields();
      },
      update_title(){
        let form = this.$refs['updateForm'].$el
        let formdata = new FormData(form);
        formdata.append("title", this.updateForm.title)
        formdata.append("id_q",this.updateForm.id_q)
        //提交表单
        this.postRequest('/Question/update/title', formdata).then(resp => {
          if (resp) {
            console.log(resp);
            //展示作业信息
            this.inittableData();
            this.$message.success("修改标题成功！");
            this.dialogVisiable = false;
          } else {
            this.$message.error(resp.msg)
          }
        })
      },
      update_question(){
        let form = this.$refs['updateForm'].$el
        let formdata = new FormData(form);
        formdata.append("question", this.updateForm.question)
        formdata.append("id_q",this.updateForm.id_q)
        //提交表单
        this.postRequest('/Question/update/question',formdata).then(resp => {
          if (resp.code===1) {
            console.log(resp);
            //展示作业信息
            this.inittableData();
            this.$message.success("修改内容成功！");
            this.dialogVisiable = false;
          } else {
            this.$message.error(resp.msg)
          }
        })
      },
      updatehomework(){
        if(this.updateForm.title!=='' && this.updateForm.question==='') {
          this.update_title();
        }else if(this.updateForm.question!=='' && this.updateForm.title===''){
          this.update_question();
        }else if(this.updateForm.question!==''&&this.updateForm.title!==''){
          this.update_title();
          this.update_question()
        }else{
          this.$message.error("不允许提交空白内容")
        }
      },
      handleEdit(index, row) {
        this.dialogVisiable = true;
        this.updateForm.id_q=row.id_q
        console.log(this.updateForm.id_q)
      },
      //删除操作
      handleDelete(index, row) {
        this.$confirm("确定删除该记录吗,该操作不可逆！！！","删除提示",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着',
        type: 'danger'
      }).then(()=> { //确认删除
        let formdata=new FormData()
          formdata.append("id_q",row.id_q)
        this.postRequest('/Question/delete',formdata).then(res => {
          if(res){
            this.inittableData();
            this.$message({type:'success',message:'删除成功！'})
          }else{
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
      })
      }
    },
    mounted(){
      this.inittableData();
    },
  }
</script>

<style lang="less" scoped>
.tables{
  width: 100%;
  border-radius: 15px;
}
</style>
