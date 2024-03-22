<template>
<body>
  <el-row style="overflow: visible">
    <el-col :span="24" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;overflow: visible">
    <el-form :inline="true">
    <el-form-item>
<!--      <el-input v-model="input" placeholder="请输入题目集标题进行查询" prefix-icon="el-icon-search" style="width: 100%;"></el-input>-->
      <el-autocomplete
          clearable
          popper-class="my-autocomplete"
          v-model="input"
          :fetch-suggestions="querySearch"
          placeholder="请输入题目集标题进行查询"
          @select="handleSelect" >
        <template slot-scope="{ item }" style="margin-top: auto">
          <span>{{ item }}</span>
        </template>
      </el-autocomplete>
    </el-form-item>
    </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24" style="height: 50px;margin-top: auto;margin-left: 15px;">
    <el-form :inline="true">
    <el-form-item>
      <el-button @click="onclick" type="primary" style="margin-top:20px;"><i class="el-icon-plus"></i>布置作业</el-button>
    </el-form-item>
    </el-form>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="20" style="height: 600px;margin-top: 20px;margin-left: 100px;">
    <el-table :row-key="({roleId})=>roleId" :data="tables[0].slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 100%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column fixed type="index" label="序号" width="120"></el-table-column>
    <el-table-column prop="title" label="标题" width="200"></el-table-column>
<!--    <el-table-column prop="belong_class" label="下发班级" width="150"></el-table-column>-->
    <el-table-column prop="id_qs" label="题目集序号" width="150"></el-table-column>
      <el-table-column prop="time_create" label="创建时间" width="200"></el-table-column>
      <el-table-column prop="time_endUp" label="截止时间" width="200"></el-table-column>
    <el-table-column fixed="right" label="操作" width="230">
      <template slot-scope="scope">
        <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
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
   <!--布置题目集-->
  <el-dialog title="布置题目集" :visible.sync="dialogVisiable" @close="setdialogVisiable('submitForm')" width="50%" style="border-radius: 30px;">
    <div style="height: 300px;margin: 0;padding: 0;">
      <el-form :model="submitForm" :rules="rules" ref="submitForm" label-width="120px" class="demo-ruleForm">
      <el-form-item  label="标题" prop="title">
        <el-input type="textarea" resize="none" v-model="submitForm.title" placeholder="请输入作业题目" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="选择下发班级" prop="belong_class" >
        <el-select v-model="submitForm.belong_class" placeholder="请至少选择一个班级" multiple>
          <el-option v-for="item in classoption1" :label="item.name"  :value="item.id_c">{{item.id_c}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择题目" prop="question" >
        <el-select v-model="submitForm.question" placeholder="请至少选择一个题目" multiple>
          <el-option v-for="item in questionoption1" :label="item.id_q" :value="item.id_q">{{item.id_q}}</el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="截止时间" prop="time_endUp" >
          <el-date-picker
              v-model="submitForm.time_endUp"
              type="datetime"
              placeholder="选择截止时间"
              value-format="timestamp">
          </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submithomework('submitForm')">发布</el-button>
        <el-button @click="resetForm('submitForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </el-dialog>
<!--  <el-dialog :visible="components" @close="closedialog">-->
<!--  <div style="flex: 1;margin-left: 10px;height:635px;">-->
<!--    <el-row style="height: 100%;">-->
<!--      <el-col :span="23" style="margin-top: auto;margin-left: 15px;">-->
<!--        <el-tabs v-model="activeName" style="margin-top: 15px; margin-left: 15px;line-height: normal;" @tab-click="handleClick">-->
<!--          <el-tab-pane label="发放班级" name="detail_t" :key="'basic_mesg'">-->
<!--            <child1  v-if="isChildUpdate1" :toChildVal="this.tableForm.id_qs"></child1>-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="题目" name="detail_q" :key="'students'" >-->
<!--            <child2  v-if="isChildUpdate2" :toChildVal="this.tableForm.id_qs"></child2>-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
<!--  </el-dialog>-->
</body>
</template>

  <script>
  import Detail_T from '@/views/Teachers/HomeWork/Detail_T.vue'
  import Detail_Q from '@/views/Teachers/HomeWork/Detail_Q.vue'
  export default {
    name: "THomeWork",
    components: {
      child1:Detail_T,
      child2:Detail_Q
    },
    data() {
      return {
        components: false,//组件打开
        isChildUpdate1:false,
        isChildUpdate2:false,
        activeName:'detail_t',
        discrible:false,
        list_q:{},
        input: '',//查询题目集模糊搜索
        restaurants:[],//存储查询列表
        stuoption:[],//获得查询学生选项
        update_c:[],//更新class选项
        update_q:[],//更新问题选项
        update: false,
        dialogVisiable: false,
        classoption1:[],//班级数组
        questionoption1:[],//题目数组
        count:0,
        currentPage:1,
        pageSize:8,
        tableForm:{
          title:'',
          id_qs:undefined,
          id_c:undefined,
        },
        ruleForm: {
          title: '',//作业标题
          id_qs: undefined,//题目集id
          question:'',//题目
          id_q:undefined,//题目序号
          belong_class:'',//下发班级
          id_c:undefined,//下发班级id
          index: 0,
          },
        updateForm:{
          id_qs:undefined,
          data:undefined,
        },
        submitForm:{
          title:'',
          question:[],//选中题目数组
          belong_class:[],//选中班级数组
          time_endUp:'',
        },
        classForm:{
          name:'',//班级
        },
        questionForm:{
          title:''
        },
        rules: {
          title: [
            {message: '请输入作业题目', trigger: 'blur'}
          ],
          question: [
            {type:'array',required: true, message: '请根据id选择题目', trigger: 'change'}
          ],
          belong_class: [
            {type:'array',required: true, message: '请至少选择一个班级', trigger: 'change'}
          ],
          time_endUp:[
            {required:true,message:'请选择截止时间',trigger:'blur'}
          ]
        },
        tableData: [],//表格渲染数据
        multipleSelection: [],//选中框
      }
    },

    methods: {
      // closedialog(){
      //   this.isChildUpdate2=false
      //   this.isChildUpdate1=false
      //   this.components=false
      // },
      // handleClick(){
      //   if(this.activeName==='detail_t'){
      //     this.isChildUpdate1=true;
      //     this.isChildUpdate2=false;
      //   }
      //   if(this.activeName==='detail_q'){
      //     this.isChildUpdate1=false;
      //     this.isChildUpdate2=true;
      //   }
      // },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.input=item;
      },
      loadAll() {
        let formdata=new FormData()
        formdata.append("title",this.ruleForm.title)
        this.postRequest('/QuestionSet/select',formdata).then(resp=>{
          if(resp){
            for(let i=0;i<resp.data.length;i++){
              this.stuoption[i]=resp.data[i].title;
            }
          }
        })
        return this.stuoption
      },
      //改变页面展示数据量方法
      handleSizeChanged(val){
        this.pageSize=val
      },
      //改变当前页面
      handleCurrentChange(val){
        this.currentPage=val
      },
      //获取题目选项
      async getoptions(){
        // let form = this.$refs['ruleForm'].$el;
        let formdata = new FormData();
        formdata.append("title", this.questionForm.title)
        let formdata2=new FormData();
        formdata2.append("name",this.classForm.name)
        this.postRequest('/Question/select_bytitle', formdata).then(resp => {
          if (resp) {
            // console.log(resp);
            //展示题目选项
            this.questionoption1=resp.data;
          } else {
            this.$message.error(resp.msg)
          }
        })
        this.postRequest('/Class/select',formdata2).then(resp=>{
          if(resp){
            //展示班级选项
            this.classoption1=resp.data;
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      onclick() {
        //嵌套表单开启
        this.dialogVisiable = true;
      },
      setdialogVisiable(formName) {
        //关闭嵌套表单
        this.dialogVisiable = false;
        this.$refs[formName].resetFields();
      },
      resetForm(formName) {
        //表单重置
        this.$refs[formName].resetFields();
      },
      submithomework() {
        //发布作业
        this.$refs.submitForm.validate((valid) => {
          if (valid) {
            // this.ruleForm.classoption2=this.getTagIds(this.ruleForm.classoption2,"array")
            // this.ruleForm.questionoption2=this.getTagIds(this.ruleForm.questionoption2,"array")
            // let params = Object.assign({}, this.ruleForm);

            this.postRequest('/QuestionSet/create', this.submitForm).then(resp => {
              if (resp) {
                console.log(resp);
                //展示题目集
                this.inittableData();
                this.$message.success("发布成功！");
                this.dialogVisiable = false;
              } else {
                this.$message.error(resp.msg)
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '还有未输入的字段！',
              type: 'error'
            });
            return false;
          }
        });
      },
      inittableData() {
        let formdata=new FormData();
        formdata.append("title",this.ruleForm.title)
        this.postRequest('/QuestionSet/select',formdata).then(resp => {
          if (resp) {
            this.tableData = resp.data
            // this.count=this.tableData.length
          }
        })
      },
      handleDelete(index, row) {
        const formData = new FormData();
        formData.append("id_qs",row.id_qs)
        this.$confirm("确定删除该记录吗,该操作不可逆！！！", "删除提示", {
          confirmButtonText: '确定删除',
          cancelButtonText: '算了,留着',
          type: 'danger'
        }).then(() => { //确认删除
          this.postRequest('/QuestionSet/delete', formData).then(res => {
            if (res) {
              this.inittableData();
              this.$message({type: 'success', message: '删除成功！'})
            }
          })
        }).catch(() => {
        })
      },
      detail(index,row){
        // this.isChildUpdate1=true
        // this.components=true
        this.tableForm.id_qs=row.id_qs
        this.$store.commit('saveid_qs',this.tableForm.id_qs)
        this.$router.replace('/teachers/homework_S')
        // this.getclass()
      }
    },
    mounted() {
      this.inittableData();
      this.getoptions();
     // this.getclass()
      this.restaurants=this.loadAll();

    },
    computed: {
      tables() { //在你的数据表格中定义tabels
        const input = this.input
        if (input!=='') {
          // console.log("input输入的搜索内容：" + this.input)
          return [this.tableData.filter(data => {
            // console.log("object:" + Object.keys(data))
            return Object.keys(data.title).some(key => {
              return String(data.title).toLowerCase().indexOf(input) > -1
            });
          }),
              this.count=this.tableData.filter((data)=>{
                return Object.keys(data).some((key)=>{
                  return String(data[key]).toLowerCase().indexOf(input)>-1;
                });
              }).length];
        }
        return [this.tableData,this.count=this.tableData.length]
      }
    }
  }
  </script>

 <style lang="less" scoped>
  *{
    margin:0;
    padding: 0;
  }
  .el-form{
   height:50px;
   justify-content: center;
  }
  </style>
