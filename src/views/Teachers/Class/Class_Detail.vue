<template>
  <div style="flex: 1;margin-left: 10px;height:635px;">
    <el-row style="height: 100%;">
      <el-col :span="23" style="margin-top: auto;margin-left: 15px;">
        <el-tabs v-model="activeName" style="margin-top: 15px; margin-left: 15px;line-height: normal;" @tab-click="handleClick" type="card">
          <el-tab-pane label="查看课程" name="basic_mesg" :key="'basic_mesg'">
            <child1  v-if="isChildUpdate1" :toChildVal="this.id_c"></child1>
          </el-tab-pane>
          <el-tab-pane label="学生用户" name="students" :key="'students'" >
            <child2  v-if="isChildUpdate2" :toChildVal="this.id_c"></child2>
          </el-tab-pane>
          <el-tab-pane label="查看题目集" name="detail" :key="'detail'">
            <child3  v-if="isChildUpdate3" @changeactivename3="changeactivename3" :toChildVal="this.id_c"></child3>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import child3 from "@/views/Teachers/Class/Detail.vue";
import child2 from "@/views/Teachers/Class/Students.vue";
import child1 from "@/views/Teachers/Class/BasicMessage.vue";

export default {
  name:'Class_Detail',
  components: {child1, child2, child3},
  data(){
    return{
      activeName: 'basic_mesg',
      // 初始化两个变量 isChildUpdate1:true，isChildUpdate2:false；
      // 使用v-if控制child1和child2是否渲染。
      // 每次切换tab选项的时候，触发事件。让当前点击的tab变量设置位true，让当前组件重新渲染。
      // 这时候当你来回切换的时候，通过v-if判断是否重新渲染当前组件
      isChildUpdate1: true,
      isChildUpdate2: false,
      isChildUpdate3: false,
      id_c:1,
    }
  },
  methods:{
    handleClick(){
      if(this.activeName==='students'){
        this.isChildUpdate1=false
        this.isChildUpdate2=true;
        this.isChildUpdate3=false;
      }
      if(this.activeName==='detail'){
        this.isChildUpdate1=false
        this.isChildUpdate2=false;
        this.isChildUpdate3=true;
      }
      if(this.activeName==='basic_mesg'){
        this.isChildUpdate1=true
        this.isChildUpdate2=false;
        this.isChildUpdate3=false;
      }
    },
    changeactivename3(){
      this.activeName='students'
      this.isChildUpdate2=true
      this.isChildUpdate3=false
    }
  },
  mounted() {
    this.id_c=this.$store.state.id_c
  }
}
</script>

<style scoped lang="less">

</style>
