<template>
    <body>
    <div style="overflow-y:visible;display: flex;margin-top: 5px;max-height: 500px;">
    <div style="overflow-y:visible;flex: 1;height: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
    <el-row>
    <el-col :span="12" style="overflow-y:visible;margin-top: 5px; margin-left: 10px; border-radius: 12px;">
    <el-form>
    <el-form-item>
      <el-button type="primary" @click="addvideo" >创建课程</el-button>
    </el-form-item>
    </el-form>
    </el-col>
    </el-row>
    <el-row>
    <el-col :span="24" style="height:600px;margin-left: 5px;overflow:visible">
    <el-table  :data="videoData" border style="width:90%;border-radius: 15px;" max-height="500" :header-row-style="{'height':'50px','line-height':'50px'}">
    <el-table-column type="selection" width="55">
    </el-table-column>
      <el-table-column fixed prop="id_course" label="序号" width="50"></el-table-column>
    <el-table-column prop="title" label="课程" width="120">
      <template scope="scope">
        <div class="titleupdate" @click="update_title(scope.row)">{{scope.row.title}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="介绍" width="220">
      <template scope="scope">
        <div class="desupdate" @click="update_des(scope.row)">{{scope.row.description}}</div>
      </template>
    </el-table-column>
      <el-table-column prop="belong_class" label="下发班级" width="150">
        <template scope="scope">
          <div @click="update_class(scope.row)">{{scope.row.belong_class}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="belong_section" label="章节(点击查看）" width="250">
        <template scope="scope" >
          <el-tag style="margin-left: 2px" :key="item" @click="look_section(item)" v-for="item in scope.row.belong_section">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time_create" label="创建时间" width="170"></el-table-column>
    <el-table-column fixed="right" label="操作" width="220">
      <template slot-scope="scope">
        <el-button size="mini" @click="upload_section(scope.$index, scope.row)">上传章节</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
      <div style="margin-top:10px;margin-left: 20%">
        <el-pagination
            @size-change="handleSizeChanged"
            @current-change="handleCurrentChange"
            background
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="count">
        </el-pagination>
      </div>
    </el-col>
    </el-row>
    </div>
    <el-dialog title="创建课程" :visible="dialogVisiable" @close="setdialogVisiable('videoForm')" width="50%" style="border-radius: 30px;line-height: normal">
     <div style="height: 250px;margin: 0;padding: 0;">
      <el-form :model="videoForm" :rules="rules" ref="videoForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="课程名" prop="title" >
        <el-input v-model="videoForm.title" placeholder="请输入课程名"></el-input>
      </el-form-item>
       <el-form-item label="介绍" prop="description" >
        <el-input v-model="videoForm.description" placeholder="请输入课程介绍" type="textarea"></el-input>
      </el-form-item>
        <el-form-item label="选择下发班级" prop="belong_class" >
          <el-select v-model="videoForm.belong_class" placeholder="请至少选择一个班级" multiple>
            <el-option v-for="item in classoption" :label="item.name"  :value="item.id_c">{{item.id_c}}</el-option>
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createvideo('videoForm')">创建</el-button>
        <el-button @click="resetForm('videoForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </el-dialog>
      <el-dialog title="上传章节" :visible="section_show" width="50%" style="border-radius: 30px;" append-to-body @close="closevisible('sectionForm')">
        <div style="height: 200px;margin: 0;padding: 0;">
          <el-form :model="sectionForm" :rules="rules2" ref="sectionForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="课程名" prop="title" >
              <el-input v-model="sectionForm.title" placeholder="请输入章节名"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="description" >
              <el-input v-model="sectionForm.description" placeholder="请输入章节介绍" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="upload('sectionForm')">上传</el-button>
              <el-button @click="resetForm('sectionForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog title="修改课程名" :visible="updatetitleshow" width="50%" style="border-radius: 30px;" append-to-body @close="closevisible1('update_titleForm')">
        <div style="height: 100px;margin: 0;padding: 0;">
          <el-form :rules="rules2" :model="update_titleForm"  ref="update_titleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="课程名" prop="data_string" >
              <el-input v-model="update_titleForm.data_string" placeholder="请输入要修改的课程名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatetitle_sub">修改</el-button>
              <el-button @click="resetForm('update_titleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog title="修改课程介绍" :visible.sync="updatedesshow" width="50%" style="border-radius: 30px;" append-to-body @close="closevisible2('update_desForm')">
        <div style="height: 100px;margin: 0;padding: 0;">
          <el-form :rules="rules3" :model="update_desForm"  ref="update_desForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="课程介绍" prop="data_string" >
              <el-input type="textarea"  v-model="update_desForm.data_string" placeholder="请输入要修改的课程介绍"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatedes_sub">修改</el-button>
              <el-button @click="resetForm('update_desForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog title="修改下发班级" :visible.sync="updateclassshow" width="50%" style="border-radius: 30px;height: max-content" append-to-body @close="closevisible3('update_classForm')">
        <div style="height: 100px;margin: 0;padding: 0;">
          <el-form :rules="rules3" :model="update_classForm"  ref="update_classForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="选择班级" prop="data_list" >
              <el-select v-model="update_classForm.data_list" placeholder="请选择一个班级" multiple>
                <el-option v-for="item in classoption" :label="item.name"  :value="item.id_c">{{item.id_c}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateclass_sub">修改</el-button>
              <el-button @click="resetForm('update_classForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
  </div>
  </body>
  </template>

  <script>
  export default{
    name:"Video",
    data(){
      return{
      count:0,
      currentPage:1,
      pageSize:8,
      name:'',
      classoption:[],//下发班级数据
      videoData:[],//课程表格数据
      dialogVisiable:false,
        section_show:false,
        id_section:Number,
      videoForm:{
        title:'',
        description:'',
        belong_class:[],
      },
      sectionForm:{
        belong_course:Number,
        title:'',
         description:'',
        },
        update_titleForm:{
        id_course:'',
        data_string:''
        },
        updatetitleshow:false,
        update_desForm:{
          id_course:'',
          data_string:''
        },
        updatedesshow:false,
        update_classForm:{
          id_course:'',
          data_list:[]
        },
        updateclassshow:false,
      formLine:{
        show:'',
      },
      rules:{
              title: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
              description: [{ required: true, message: '请输入课程介绍', trigger: 'blur' }],
       },
        rules2:{
          title: [{ required: true, message: '请输入章节名', trigger: 'blur' }],
          description: [{ required: true, message: '请输入章节介绍', trigger: 'blur' }],
          data_string: [{ required: true, message: '请输入要修改的课程名', trigger: 'blur' }],
        },
        rules3:{
          data_string: [{ required: true, message: '请输入要修改的课程介绍', trigger: 'blur' }],
          data_list: [{type:'array', required: true, message: '请选择要添加的班级', trigger: 'change' }],
        }
     }
    },
    methods:{
      //改变页面展示数据量方法
      handleSizeChanged(val){
        this.pageSize=val
      },
      //改变当前页面
      handleCurrentChange(val){
        this.currentPage=val
      },
      ininttable(){
          this.postRequest('/Course/select/creater').then(resp => {
            if (resp.code===1) {
              // this.$message.success("创建成功！")
              this.videoData = resp.data
              // for(let i=0;i<resp.data.length;i++){
              //   this.sectionData[i]=resp.data.belong_section[i]
              // }

              this.count=this.videoData.length
            }
          })
      },
      addvideo(){
        this.dialogVisiable=true;
        this.getclass()
      },
      setdialogVisiable(formName){
        //关闭嵌套表单
        this.dialogVisiable=false;
        this.$refs[formName].resetFields();
      },
      closevisible(formName){
        this.section_show=false;
        this.$refs[formName].resetFields();
      },
      closevisible1(formName){
        this.updatetitleshow=false;
        this.$refs[formName].resetFields();
      },
      closevisible2(formName){
        this.updatedesshow=false;
        this.$refs[formName].resetFields();
      },
      closevisible3(formName){
        this.updateclassshow=false;
        this.$refs[formName].resetFields();
      },
      update_title(row){
        // console.log(row)
        this.updatetitleshow=true
        this.update_titleForm.id_course=row.id_course
      },
      updatetitle_sub(){
        this.postRequest('Course/update/title',this.update_titleForm).then(resp=>{
          if(resp.code===1){
            this.$message.success("修改课程名成功！")
            this.updatetitleshow=false
            this.ininttable()
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      update_des(row){
        this.updatedesshow=true
        this.update_desForm.id_course=row.id_course
      },
      updatedes_sub(){
        this.postRequest('Course/update/description',this.update_desForm).then(resp=>{
          if(resp.code===1){
            this.$message.success("修改课程介绍成功！")
            this.updatedesshow=false
            this.ininttable()
          }else{
            this.$message.error(resp.msg)
          }
        })
  },
      update_class(row){
        this.updateclassshow=true
        this.getclass()
        this.update_classForm.id_course=row.id_course

      },
      updateclass_sub(){
        this.postRequest('Course/update/belong_class',this.update_classForm).then(resp=>{
          if(resp.code===1){
            this.$message.success("修改班级成功！")
            this.updateclassshow=false
            this.ininttable()
          }
          else{
            this.$message.error(resp.msg)
          }
        })
      },
      createvideo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postRequest('/Course/create',this.videoForm).then(resp=>{
              if(resp.code===1){
                this.videoData=resp.data;
                this.dialogVisiable=false
                this.$message.success("创建课程成功！")
                this.ininttable()
              }
              else{
                this.$message.error(resp.msg)
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleDelete(index, row) {
        const formData = new FormData();
        formData.append("id_course",row.id_course)
        this.$confirm("确定删除该记录吗,该操作不可逆！！！", "删除提示", {
          confirmButtonText: '确定删除',
          cancelButtonText: '算了,留着',
          type: 'danger'
        }).then(() => { //确认删除
          this.postRequest('/Course/delete', formData).then(res => {
            if (res.code===1) {
              this.ininttable()
              this.$message({type: 'success', message: '删除成功！'})
            }else{
              this.$message.error(res.msg)
            }
          })
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getclass(){
        let formdata2=new FormData()
        formdata2.append("name",this.name)
        this.postRequest('/Class/select',formdata2).then(resp=>{
          if(resp){
            //展示班级选项
            this.classoption=resp.data;
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      upload_section(index,row){
        this.section_show=true
        this.sectionForm.belong_course=row.id_course
      },
      upload(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postRequest('/Section/create',this.sectionForm).then(resp=>{
              if(resp.code===1){
                this.sectionData=resp.data;
                this.ininttable()
                this.$message.success("上传成功")
                this.section_show=false
              }
              else{
                this.$message.error(resp.msg)
              }
            })
          }
        });
      },
      look_section(item){
        this.id_section=item
        this.$store.commit('saveid_section',this.id_section)
        this.$router.push('/teachers/section')
      }
    },
    mounted() {
      this.ininttable()
    }
  }
  </script>

  <style>
  .el-dialog__header {
    background-color: #409EFF;
  }
  .el-tag:hover{
    background-color: #fff;
  }
  .titleupdate:hover{
    background-color: #f1e7e7;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 50px;
  }
  .desupdate:hover{
    background-color: #d2cbcb;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 50px;
  }
  .el-dialog__title {
    color: #f9fafc!important;
  }
  </style>
