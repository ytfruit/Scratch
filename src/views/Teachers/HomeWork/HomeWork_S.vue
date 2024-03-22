<template>
  <div style="flex: 1;margin-left: 10px;height:635px;">
    <el-row style="height: 100%;">
      <el-col :span="23" style="margin-left: 15px;">
        <el-tabs v-model="activeName" style="margin-top: 15px; margin-left: 15px;line-height: normal;" @tab-click="handleClick" type="card">
          <el-tab-pane label="发放班级" name="detail_t" :key="'detail_t'">
            <child1  v-if="isChildUpdate1" :toChildVal="this.id_qs"></child1>
          </el-tab-pane>
          <el-tab-pane label="查看题目" name="detail_q" :key="'detail_q'" >
            <child2  v-if="isChildUpdate2" :toChildVal="this.id_qs"></child2>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import child1 from "@/views/Teachers/HomeWork/Detail_T.vue";
import child2 from "@/views/Teachers/HomeWork/Detail_Q.vue";

export default {
  name:'HomeWork_S',
  components: {child1, child2},
  data(){
    return{
      activeName: 'detail_t',
      // 初始化两个变量 isChildUpdate1:true，isChildUpdate2:false；
      // 使用v-if控制child1和child2是否渲染。
      // 每次切换tab选项的时候，触发事件。让当前点击的tab变量设置位true，让当前组件重新渲染。
      // 这时候当你来回切换的时候，通过v-if判断是否重新渲染当前组件
      isChildUpdate1: true,
      isChildUpdate2: false,
      id_qs:1,
    }
  },
  methods:{
    handleClick(){
      if(this.activeName==='detail_t'){
        this.isChildUpdate1=true
        this.isChildUpdate2=false;
      }
      if(this.activeName==='detail_q'){
        this.isChildUpdate1=false;
        this.isChildUpdate2=true;
      }
    },
  },
  mounted() {
    this.id_qs=this.$store.state.id_qs
  }
}
</script>

<style scoped lang="less">

</style>
