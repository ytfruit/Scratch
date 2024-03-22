<template>
  <body>
    <el-row>
    <el-col :span="24" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;line-height: normal;">
    <el-form :inline="true">
    <el-form-item>
<!--    <el-input v-model="input" placeholder="请输入学生名字进行查询" prefix-icon="el-icon-search"></el-input>-->
      <el-autocomplete
          clearable
          popper-class="my-autocomplete"
          v-model="input"
          :fetch-suggestions="querySearch"
          placeholder="请输入学生名字进行查询"
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
<!--    <el-col :span="24" style="height: 50px;margin-top: auto;margin-left: 15px;">-->
<!--    <el-form :inline="true">-->
<!--    <el-form-item><el-button @click="addstudents" type="primary" style="margin: auto;"><i class="el-icon-plus"></i>添加学生</el-button></el-form-item>-->
<!--    </el-form> -->
<!--    </el-col>-->
    </el-row>
    <el-row>
    <el-col :span="20" style="height: 550px;margin-top: auto;margin-left:10%;">
    <el-table :row-key="({roleId})=>roleId" :data="tables[0].slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="margin-left:5%;width: 90%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
    <el-table-column type="selection" width="55">
    </el-table-column>
      <el-table-column fixed type="index" label="序号" width="150"></el-table-column>
    <el-table-column fixed prop="id" label="学生ID" width="150"></el-table-column>
    <el-table-column prop="name" label="学生姓名" width="200"></el-table-column>
    <el-table-column prop="phoneNumber" label="电话号码" width="200"></el-table-column>
    <el-table-column prop="type" label="类型" width="170"></el-table-column>
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
  </body>
</template>
  
  <script>
  export default {
    name: "studentsMessage",
    data() {
      return {
        input:'',
        restaurants:[],
        stuoption:[],
        timeout:  null,
        dialogVisiable: false,
        count:0,
        currentPage:1,
        pageSize:8,
        studentsData: [],
        ruleForm: {
          id: '',//学生id
          name: '',//学生名字
          gender: '',//学生性别
          phoneNumber: '',//学生电话号码
        },
      }
    },
    methods: {
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
      loadAll() {
        let formdata=new FormData()
        formdata.append("name",this.ruleForm.name)
       this.postRequest('homepage/getStuInfo',formdata).then(resp=>{
          if(resp){
           for(let i=0;i<resp.data.length;i++){
             this.stuoption[i]=resp.data[i].name;
           }
          }
        })
        return this.stuoption
      },
      handleSelect(item) {
        this.input=item;
      },
      //改变页面展示数据量方法
      handleSizeChanged(val){
        this.pageSize=val;
    },
      //改变当前页面
  handleCurrentChange(val){
    this.currentPage=val
  },
      inittableData() {
        let formdata=new FormData()
        formdata.append("name",this.ruleForm.name)
        this.postRequest('homepage/getStuInfo',formdata).then(resp => {
          if (resp) {
            console.log(resp)
            this.studentsData = resp.data;
          }
        })
      },
      handlelook(index, data) {
        console.log(index, data);
      },
      handleDelete(index, data) {
        console.log(index, data);
      },
    },
    mounted() {
      this.inittableData();
      this.restaurants=this.loadAll();
    },
    computed: {
      tables() { //在你的数据表格中定义tabels
        const input = this.input
        if (input!=='') {
          console.log("input输入的搜索内容：" + this.input)
          return [this.studentsData.filter(data => {
            console.log("object:" + Object.keys(data))
            return Object.keys(data.name).some(key => {
              return String(data.name).toLowerCase().indexOf(input) > -1
            });
          }),
            this.count=this.studentsData.filter((data)=>{
              return Object.keys(data).some((key)=>{
                return String(data[key]).toLowerCase().indexOf(input)>-1;
              });
            }).length];
        }
        return [this.studentsData,this.count=this.studentsData.length]
      }
    }
  }
  </script>
  
<style lang="less" scoped>
 
</style>