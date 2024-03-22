<template>
  <body>
    <div style="display: flex;margin-top: 5px;max-height: 500px;">
    <div style="flex: 1;margin-right: 10px;height: 100%; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
    <el-row>
    <el-col :span="20" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;">
    <el-form :model="update_titleForm" ref="update_titleForm">
    <el-form-item>
      <el-button type="primary" @click="addclass" >添加/创建班级</el-button>
    </el-form-item>
    <el-form-item prop="name">
      <el-col :span="20">
<!--      <el-input v-model="input" placeholder="请输入班级id进行查询" prefix-icon="el-icon-search" style="width: 100%;"></el-input>-->
        <el-autocomplete
            clearable
            popper-class="my-autocomplete"
            v-model="input"
            :fetch-suggestions="querySearch"
            placeholder="请输入班级名称进行查询"
            @select="handleSelect" >
          <template slot-scope="{ item }" style="margin-top: auto">
            <span>{{ item }}</span>
          </template>
        </el-autocomplete>
      </el-col>
    </el-form-item>
    </el-form>
    </el-col>
    </el-row>
    <el-row>
    <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
    <el-table :row-key="({roleId})=>roleId" :data="tables[0].slice((currentPage-1)*pageSize,currentPage*pageSize)" border stripe ref="multipleTable" tooltip-effect="dark"
              style="width: 89%;border-radius: 15px;" max-height="500" :header-row-style="{'height':'50px','line-height':'50px'}">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column fixed="right" type="index" label="序号" width="100"></el-table-column>
    <el-table-column fixed="right" prop="id_c" label="班级id" width="120"></el-table-column>
    <el-table-column fixed="right" prop="name" label="班级名称" width="220">
      <template slot-scope="scope">
        <span v-if="!isshow[scope.$index]">{{scope.row.name}}</span>
        <el-input  v-if="isshow[scope.$index]"  v-model="inputValue" style="width: 100%;"
       @keyup.enter.native="handleInputConfirm(scope.$index, scope.row)" @blur="handleInputConfirm(scope.$index, scope.row)" placeholder="请填写要修改的名称"></el-input>
      </template>
    </el-table-column>
      <el-table-column fixed="right" prop="teacher" label="所属教师" width="140"></el-table-column>
      <el-table-column fixed="right" prop="num_stu" label="学生人数" width="140"></el-table-column>
      <el-table-column fixed="right" label="修改" width="150">
        <template slot-scope="scope">
        <el-button v-if="!isshow[scope.$index]" size="mini" @click="showinput(scope.$index,scope.row)">编辑</el-button>
        </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="200" :key="new Date().getTime()">
      <template slot-scope="scope">
        <el-button size="mini" @click="handlelook(scope.$index, scope.row)">详情</el-button>
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
    <el-dialog title="创建班级" :visible="dialogVisiable" @close="setdialogVisiable('ruleForm')" width="50%" style="border-radius: 30px;">
     <div style="height: 200px;margin: 0;padding: 0;">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item  label="班级名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入班级名称"></el-input>
      </el-form-item>
      <el-form-item label="选择学生名字" prop="id" >
        <el-select v-model="ruleForm.stu" placeholder="请至少选择一个学生" multiple>
          <el-option v-for="item in stuoption" :key="item.id"  :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="上传作业文件" prop="" >
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="createclass('ruleForm')">创建班级</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </el-dialog>
<!--    <el-dialog :visible="components" @close="closedialog">-->
<!--    <div style="flex: 1;margin-left: 10px;height:635px;">-->
<!--      <el-row style="height: 100%;">-->
<!--      <el-col :span="23" style="margin-top: auto;margin-left: 15px;">-->
<!--      <el-tabs v-model="activeName" style="margin-top: 15px; margin-left: 15px;line-height: normal;" @tab-click="handleClick">-->
<!--        <el-tab-pane label="查看课程" name="basic_mesg" :key="'basic_mesg'">-->
<!--          <child1  v-if="isChildUpdate1" :toChildVal="this.tableForm.id_c"></child1>-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="学生用户" name="students" :key="'students'" >-->
<!--          <child2  v-if="isChildUpdate2" :toChildVal="this.tableForm.id_c"></child2>-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="查看题目集" name="detail" :key="'detail'">-->
<!--          <child3  v-if="isChildUpdate3" @changeactivename3="changeactivename3" :toChildVal="this.tableForm.id_c"></child3>-->
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->
<!--      </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
<!--    </el-dialog>-->
    </div>
  </body>
</template>

<script>
import Detail from '@/views/Teachers/Class/Detail'
import Students from '@/views/Teachers/Class/Students'
import BasicMessage from '@/views/Teachers/Class/BasicMessage'
  export default{
    name:"TClass",
    data(){
      return{
        input:'',//查询班级
        inputValue:'',//要编辑班级名称内容
        isshow:[],
        count:0,
        currentPage:1,
        pageSize:8,
        restaurants:[],
        classoption:[],//班级name模糊查询
        stuoption:[],//学生用户查询
        update_stu:[],//更新学生用户
        name:'',//获取学生选项的参数
        components: false,//组件打开
        tableForm:{
          id_c:undefined,
          name:'',
        },
        ruleForm:{
          name:'',//班级姓名
          stu:[],//学生id
        },
        update_titleForm:{
          id_c:undefined,
          name:''
        },
        classData:[],//表格数据
        dialogVisiable:false,//创建班级对话框打开
        rules:{
              name: [
                { required: true, message: '请输入班级名称', trigger: 'blur' }
              ],
              stu:[
                { required:true,message:'请至少选择一个学生',trigger:'change'}
              ],
        },
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
        let formdata=new FormData();
        formdata.append('name',this.name)
        this.postRequest('/Class/select',formdata).then(resp=>{
          if(resp){
            for(let i=0;i<resp.data.length;i++){
              this.classoption[i]=resp.data[i].name;
            }
          }
        })
        return this.classoption
      },
      async getoptions(){
        // let form = this.$refs['ruleForm'].$el;
        // let formdata = new FormData();
        // formdata.append("id", this.ruleForm.id)
        //提交表单
        let formdata=new FormData()
        formdata.append("name",this.name)
        this.postRequest('/homepage/getStuInfo',formdata).then(resp => {
          if (resp) {
            // console.log(resp);
            //展示学生选项
            for(let i=0;i<resp.data.length;i++){
              this.stuoption[i]=resp.data[i]
            }

          } else {
            this.$message.error(resp.msg)
          }
        })
      },
      showinput(index,row){
        this.$set(this.isshow,index,true)
      },
      handleInputConfirm(index,row) {
        if(this.inputValue!==''){
          this.update_titleForm.id_c=row.id_c
          this.update_titleForm.name=this.inputValue;
          // console.log(this.update_titleForm)
          // this.inittableData();
          this.update_title();
        } else{
          this.$set(this.isshow,index,false)
          // this.inputValue=''
        }
          // this.update_title()
        // this.inputfalse = false;
        // this.inputValue = '';
      },
      update_title(){
        let formData=new FormData()
        formData.append("id_c",this.update_titleForm.id_c)
        formData.append("name",this.update_titleForm.name)
        this.postRequest('/Class/update/name',formData).then(resp=>{
          if (resp.code===1) {
            this.$message.success("修改成功！")
            this.inittableData()
            this.inputValue=''
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      addclass(){
        this.dialogVisiable=true;
      },
      setdialogVisiable(formName){
        //关闭嵌套表单
        this.dialogVisiable=false;
        this.$refs[formName].resetFields();
      },
      inittableData(){
        let formdata=new FormData();
        formdata.append('name',this.name)
        this.postRequest('/Class/select',formdata).then(resp=>{
          if(resp.code===1){
              this.classData=resp.data;
            // console.log(this.classData)
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      createclass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this. postRequest('/Class/create',this.ruleForm).then(resp=>{
                        if(resp.code===0){
                            // console.log(resp);
                            this.$message.error(resp.msg);
                        }else{
                          this.$message.success("创建成功！");
                          this.inittableData()
                          this.dialogVisiable=false
                        }
                    })
          } else {
            console.log('error createclass!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closedialog(){
        this.isChildUpdate3=false
        this.isChildUpdate2=false
        this.components=false
      },
      handlelook(index, row) {
        // this.components=true
        // this.activeName='detail'
        // this.isChildUpdate3=true;
        // this.tableForm.name=row.name
        // this.tableForm.id_c=row.id_c
        this.$router.replace('/teachers/class_detail')
        this.$store.commit('saveid_c',row.id_c)
      },
      handleDelete(index, row) {
        const formData = new FormData();
        formData.append("id_c",row.id_c)
        this.$confirm("确定删除该班级吗,该操作不可逆！！！", "删除提示", {
          confirmButtonText: '确定删除',
          cancelButtonText: '算了,留着',
          type: 'danger'
        }).then(() => { //确认删除
          this.postRequest('/Class/delete',formData).then(res => {
            if (res.code===1) {
              this.inittableData();
              this.$message({type: 'success', message: '删除成功！'})
            }else{
              this.$message.error(resp.msg)
            }
          })
        }).catch(() => {
        })
      },
    },
    mounted(){
      this.inittableData();
      this.getoptions();
      this.restaurants=this.loadAll();
    },
    computed: {
      tables() { //在你的数据表格中定义tabels
        const input = this.input
        if (input !== '') {
          // console.log("input输入的搜索内容：" + this.input)
          return [this.classData.filter(data => {
            // console.log("object:" + Object.keys(data))
            return Object.keys(data.name).some(key => {
              return String(data.name).toLowerCase().indexOf(input) > -1
            });
          }),
            this.count = this.classData.filter((data) => {
              return Object.keys(data).some((key) => {
                return String(data[key]).toLowerCase().indexOf(input) > -1;
              });
            }).length];
        }
        return [this.classData, this.count = this.classData.length]
      }
    }
}
</script>

<style>
  .body{
    height: 100%;
    margin: 0;
  }
</style>
