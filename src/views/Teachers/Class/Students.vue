<template>
    <div class="child2">
    <el-row>
    <el-col :span="12" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;">
    <el-form :inline="true">
    <el-form-item prop="add">
      <el-autocomplete
          clearable
          popper-class="my-autocomplete"
          v-model="input"
          :fetch-suggestions="querySearch"
          placeholder="请输入学生名字进行查询"
          @select="handleSelect" >
        <template slot-scope="{ item}" style="margin-top: auto">
          <span>{{ item.name}}</span>
        </template>
      </el-autocomplete>
    </el-form-item>
    </el-form>
    </el-col>
      <el-col :span="3" style="margin-top: 10px; margin-left: 15px; border-radius: 12px;">
        <el-form>
        <el-form-item prop="add">
          <el-button type="primary" @click="adddialog"><i class="el-icon-plus"></i>添加学生</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
    <el-table border :row-key="row=>row.roleId" :data="tables" stripe style="width: 75%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column fixed type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="id" label="学生id" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="200"></el-table-column>
      <el-table-column prop="phoneNumber" label="电话号码" width="190"></el-table-column>
<!--      <el-table-column prop="homework" label="作业文件" width="140"></el-table-column>-->
    <el-table-column fixed="right" label="操作" width="180">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    </el-col>
    </el-row>
      <el-dialog title="添加学生" :visible.sync="addVisiable"  width="45%" style="border-radius: 30px;" append-to-body>
        <el-select
            clearable
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入要查询的学生名字"
            :loading="loading" style="width: 60%">
          <el-option v-for="item in uninclassStu" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-table highlight-current-row :row-key="row=>row.row" :data="searchtable" stripe style="width: 100%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
          <el-table-column fixed type="selection" width="55"></el-table-column>
          <el-table-column  type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="id" label="学生id" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="phoneNumber" label="电话号码" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini"  @click="add_stu(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>

<script>
  import index from "vuex";

  export default{
    name:"child2",
    props:{
      toChildVal:Number
    },
    data(){
        return{
            name:'',
            uninclass_name:'',
            addVisiable:false,
            input:'',
            restaurants:[],
            newStu:[],
            uninclassStu:[],
            value: '',
            list: [],
            loading: false,
            stuoption:[],
            update_stuForm:{
            id_c:this.toChildVal,
            data:undefined,
            },
            studentsData:[],
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
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.input = item.name;
      },
      loadAll() {
        return this.newStu
      },
      inittableData() {
        let formdata = new FormData();
        formdata.append("id_c", this.toChildVal)
        this.postRequest('/Class/getSTU', formdata).then(resp => {
          if (resp) {
            this.studentsData = resp.data;
            this.$store.commit("savestu_id", resp.data)
          }
        })
      },
      async getinclass_option() {
        let fomdta = new FormData()
        fomdta.append("name", this.uninclass_name)
        this.postRequest('/homepage/getSTU_NOTinclass', fomdta).then(resp => {
          if (resp.code === 1) {
            this.uninclassStu = resp.data
          } else {
            this.$message.error(resp.msg)
          }
        })
      },
      async getoptions() {
        // let form = this.$refs['ruleForm'].$el;
        // let formdata = new FormData();
        // formdata.append("id", this.ruleForm.id)
        //提交表单
        let formdata = new FormData()
        formdata.append("name", this.name)
        this.postRequest('/homepage/getStuInfo', formdata).then(resp => {
          if (resp.code === 1) {
            // console.log(resp);
            //展示学生选项
            for (let i = 0; i < resp.data.length; i++) {
              this.stuoption[i] = resp.data[i]
            }
          } else {
            this.$message.error(resp.msg)
          }
        })
      },
      handleDelete(index, row) {
        this.update_stuForm.data = row.id
        this.$confirm("确定删除该学生吗？", "删除提示", {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => { //确认删除
          this.postRequest('/Class/update/stu/remove', this.update_stuForm).then(res => {
            if (res) {
              this.inittableData();
              this.$message({type: 'success', message: '删除成功！'})
            }
          })
        }).catch(() => {
        })
      },
      adddialog() {
        this.addVisiable = true;
        this.getinclass_option()
      },
      add_stu(index, row) {
        this.update_stuForm.data = row.id
        this.postRequest('/Class/update/stu/add', this.update_stuForm).then(resp => {
          if (resp) {
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            })
            this.getinclass_option()
            this.addVisiable = false;
          }
          this.inittableData()
        })
      },
    },
    mounted() {
      this.inittableData();
      this.getoptions();
      this.restaurants=this.loadAll();
    },
    computed: {
      index() {
        return index
      },
      tables() { //在你的数据表格中定义tabels
        const input = this.input
        if (input) {
          // console.log("input输入的搜索内容：" + this.input)
          return this.studentsData.filter(data => {
            // console.log("object:" + Object.keys(data))
            return Object.keys(data).some(key => {
              // console.log(data.name)
              return String(data.name).toLowerCase().indexOf(input) > -1
            })
          })
        }
        return this.studentsData;
      },
      searchtable() {
        // console.log(row.name)
        if (this.value) {
          // console.log("input输入的搜索内容：" + this.input)
          return this.uninclassStu.filter(data => {
            // console.log("object:" + Object.keys(data))
            return Object.keys(data.name).some(key => {
              // console.log(data.name)
              return String(data.name).toLowerCase().indexOf(this.value) > -1
            })
          })
        }
        return this.uninclassStu
      },
    },
    created() {
      this.newStu=this.$store.state.newStu
    },
  }
</script>

<style lang="less" scoped>
.body{
    margin: 0;
    padding: 0;
}

</style>
