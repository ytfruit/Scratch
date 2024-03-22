<template>
    <div class="child1">
      <el-row>
        <el-col :span="24" style="height: 500px;margin-top: auto;margin-left: 15px;">
          <el-table  :data="courseData" border style="width:95%;border-radius: 15px;" max-height="500" :header-row-style="{'height':'50px','line-height':'50px'}">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed prop="id_course" label="序号" width="150"></el-table-column>
            <el-table-column prop="title" label="课程" width="150"></el-table-column>
            <el-table-column prop="description" label="介绍" width="200"></el-table-column>
            <el-table-column prop="belong_class" label="下发班级" width="150"></el-table-column>
            <el-table-column prop="time_create" label="创建时间" width="200"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default{
    name:"child1",
    props:{
      toChildVal:Number
    },
    data(){
      return{
        courseData:[],
      }
    },
    methods:{
      inittableData() {
        let formdata = new FormData();
        formdata.append("id_class", this.toChildVal)
        this.postRequest('/Course/select/id_class', formdata).then(resp => {
          if (resp.code===1) {
            this.courseData = resp.data;
          }else{
            this.$message.error(resp.msg)
          }
        })
      },
      handleDelete(){

      }
    },
    mounted() {
      this.inittableData()
    }
  }
</script>

<style>

</style>
