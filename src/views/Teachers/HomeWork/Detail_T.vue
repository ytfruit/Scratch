<template>
  <el-row>
    <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
      <el-form :rules="rules"  :model="updateForm" ref="updateForm">
        <el-form-item prop="data" label="选择班级">
          <el-select @click.native="getoption" v-model="select_c" placeholder="请选择班级id后增加">
            <el-option v-for="item in classoption" :key="item.id_c" :label="item.name"  :value="item.id_c">{{item.name}}</el-option>
          </el-select>
          <el-button  @click="add_c"  style="margin-left: 10px" type="primary">增加班级</el-button>
      </el-form-item>
      </el-form>
      <el-table :data="update_c" :row-key="row=>row.roleId" stripe style="width: 60%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="id_c" label="班级ID" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name:'child1',
  props:{
    toChildVal:Number,
  },
  data(){
    return{
      name:'',
      select_c:undefined,
      update_c:[],
      classoption:[],
      updateForm:{
        id_qs:this.toChildVal,
        data:undefined,
      },
      rules:{
        data:[{required: true, message: '请选择班级', trigger: 'change'}],
      }
    }
  },
  methods:{
    add_c() {
      this.updateForm.id_qs=this.toChildVal
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
        this.postRequest('/QuestionSet/update/belong_class/add', this.updateForm).then(resp => {
          if (resp.code===1) {
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            })
            this.getclass()
          }else{
            this.$message.error("该题目集已发放至此班级")
          }
        })
      }
      })
    },
    //获取班级选项
    getoption(){
      this.updateForm.data=this.select_c;
      let formdata2=new FormData();
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
    //获取下发班级
    async getclass(){
      let formdata=new FormData();
      formdata.append("id_qs",this.toChildVal)
      this.postRequest('/QuestionSet/select/detail',formdata).then(resp=>{
        if(resp.code===1){
          this.update_c=resp.data.belong_class.map(item=>{
            return {id_c:item}
          })
          console.log(this.update_c)
        }else{
          this.$message.error(resp.msg)
        }
        // console.log(this.update_c)
      })
    },
   handleDelete(index, row) {
      // this.updateForm.data=this.select_c;
      // console.log(row.id_c)
      this.updateForm.data=row.id_c
      this.$confirm("确定删除该班级吗？", "删除提示", {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => { //确认删除
        this.postRequest('/QuestionSet/update/belong_class/remove',this.updateForm).then(resp=>{
          if (resp.code===1) {
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success'
            })
              this.getclass()
          }else{
            this.$message.error(resp.msg)
          }
        })
    }).catch(() => {

      })
    }
  },
  mounted() {
    this.getclass()
    // this.getoption()
  },

}

</script>

<style scoped lang="less">

</style>
