<template>
<body>
    <div>
      <el-empty style="margin-top: 50px" description="您尚未加入班级" v-if="!showclass"></el-empty>
      <el-row>
        <el-col :span="24" style="height: 200px;width:40%;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" v-if="showclass">
          <el-descriptions title="班级信息" :column="1" style="margin-left: 3%;margin-top: 1%" >
            <el-descriptions-item label="所在班级">{{classForm.name}}</el-descriptions-item>
            <el-descriptions-item label="老师">{{classForm.teacher}}</el-descriptions-item>
            <el-descriptions-item label="教师联系电话">
             {{classForm.phoneNumber_teacher}}
            </el-descriptions-item>
            <el-descriptions-item label="备注">
              <el-tag size="small">{{classForm.id_c}}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </div>
    <div style=" margin-top: 10px;width:100%;height: 50px;background-color: #627aa1;" v-if="showclass">
    <span style="margin-left: 50%;height: 50px;line-height: 50px;font-weight: bold;color: #fffefe;">班级成员</span>
    </div>
    <el-table v-if="showclass" :row-class-name="tableRowClassName" :data="classForm_S.stu" :row-key="row=>row.roleId" stripe style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);margin-left: 10%;margin-top: 2%;width: 80%;border-radius: 15px;" max-height="500px" :header-row-style="{'height':'30px','line-height':'50px'}">
      <!-- <el-empty description="教师未上传章节"></el-empty> -->
      <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="id" label="学生ID">
        </el-table-column>
        <el-table-column label="姓名" prop="name">
        </el-table-column>
        <el-table-column label="电话号码" prop="phoneNumber">
        </el-table-column>
        <!-- <template slot-scope="scope">
        <el-button size="mini" @click="detail(scope.$index, scope.row)">详情</el-button>
      </template> -->
      </el-table>

  </body>
</template>

  <script>
  export default{
    name:"Space",
    data(){
        return{
          classForm:{},
          classForm_S:{},
          stu:[],
          drawer: false,
          direction: 'rtl',
          id:'',
          stu_row:0,
          show: false,
          visible:false,
          showclass:true
        }
    },
    methods:{
      tableRowClassName ({row, rowIndex}) {
   //把每一行的索引放进row
   row.index = rowIndex;
},
      lookmessage(){
        // this.stu_row=row.index
        // // console.log(this.stu_row)
        // this.id=row.id;
        // // console.log(this.id)
        // let formdata=new FormData()
        // formdata.append('id',this.id)
        this.postRequest('/Class/select/forstu').then(resp=>{
          if(resp.code===1){
            this.classForm=resp.data
            this.show=true
           this.classForm_S=resp.data
          }else{
            this.showclass=false
          }
        })
      }
    },
    mounted() {
      this.lookmessage()
    }


  }
  </script>

<style lang="less" scoped>
  *{
    margin:0;
    padding: 0;
  }
  .top1{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width:500px;
    background-color: #17e1bf;
    border-radius: 15px;
  }
  .top2{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width:500px;
    background-color: #17e1bf;
    border-radius: 15px;
    margin-left: 40px;
  }
</style>
