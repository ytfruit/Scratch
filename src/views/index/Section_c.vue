
<template>
<body>
<el-row>
  <el-col :span="6">
    <div class="aside" >
      <p style="margin-left:5px;height: 50px;line-height: 50px;font-weight: bold;background-color:rgb(98,122,161);">
        <span style="width:50%;margin-left: 40%;height: 50px; line-height: 50px;font-weight: bold;color: rgb(255, 254, 254);">章节目录</span>
      </p>
      <div v-for="(item,index) in sectiondetail" style="height:50px;line-height: normal;max-height: 50px;overflow: visible">
        <el-tooltip class="item" effect="dark" placement="right-start">
          <div slot="content" >{{item.description}}</div>
          <el-button @click="getvideo(item.id_section)">{{"第"+(index+1)+"章"+"---"+item.title}}</el-button>
        </el-tooltip>
      </div>
      <el-empty style="width: 100px;height: 50px;margin-left: 100px;margin-top: 100px;" description="教师未上传章节" v-if="!showsection"></el-empty>
    </div>
  </el-col>
  <el-col :span="17">
    <div class="video">
      <video type="video/mp4" id="sound" class="video-js" preload="auto" :auto-play="false" controls muted :src="video" v-if="video!==''" style="width:100%; height:100%; object-fit: fill"></video>
      <el-empty style="margin-top: 50px" description="教师未上传视频" v-if="video==='' &&!show_s"></el-empty>
      <el-empty style="margin-top: 50px" description="可点击章节查看视频，若未显示请刷新或教师未上传视频" v-if="video==='' && show_s"></el-empty>
    </div>
  </el-col>

</el-row>


</body>
</template>

<script>
import Video from "@/views/Teachers/Class/Video.vue";

export default {
  name:'Section_c',
  components: {Video},
  data(){
    return{
      defaultProps:{
        children:'',
        label:''
      },
      treedata:[],
      section_c:[],
      count:0,
      pageNumber:2,
      currentPage:1,//题目集分页处理
      sectionForm:{},
      show_s:true,
      id_course:0,
      // video:'',
      id_section:'',
      video_yet:[],
      video:'',
      sectiondetail:[],
      showsection:true
    }
  },
  methods:{
     getvideo(item){
       //console.log(item)
      // this.id_section=this.$store.state.id_section
      // console.log(this.id_section)
      // console.log(this.id_section)
      // let formdata=new FormData()
      // formdata.append("id_section",this.id_section)
      // const params = new URLSearchParams(formdata)
      // console.log(this.id_section)
      this.getRequest('http://localhost:8080/file/download/video',{},{params:{id_section:item},responseType: 'blob'}).then(resp => {
        if (resp.size!==0) {
          // console.log(header)
          let blob=new Blob([resp],{type: "video/mp4"})
          this.video=window.URL.createObjectURL(blob)
          // this.show_s=true
          // this.$set(this.section_c,"video",this.video)
          // this.video_yet.push(this.video)
          // console.log(this.video)
        }else{
          this.video=''
          this.show_s=false
          // this.show_s=false
        }
      })
      //this.video_yet[i]=this.video
        this.$store.commit('savevideo_yet',this.video_yet)
      // this.$set(this.section_c[i],"video",this.video

    // for(let i=0;i<this.section_c.length;i++)
    // {
    // }
  //  console.log(this.section_c)
  },
    //  async getvideo_monted(){
    //   this.section_c.forEach(async id=>{
    //      this.video_yet.push(this.getvideo(id))
    //   })
    //   // const res=await Promise.all(this.video_yet)
    //   console.log(this.video_yet)
    // },
    getsection(){
      let formdata=new FormData()
      formdata.append('id_course',this.id_course)
      this.postRequest('/Course/select/id_course/detail',formdata).then(resp=>{
        if(resp.code===1){
          this.sectiondetail=resp.data.belong_section;
          // this.sectiondetail=this.sectiondetail.map((item,index)=>{
          //   return{
          //     video:'',
          //     ...item
          //   }
          // })
          for(let i=0;i<resp.data.length;i++){
             this.section_c=resp.data.belong_section[i].id_section
          }
          // this.$store.commit('savesection_detail',this.sectiondetail)
          //this.getvideo()
          this.video_yet=this.$store.state.video_yet
        // for(let i=0;i<this.sectiondetail.length;i++){
        //   this.sectiondetail[i].video=this.video_yet[i]
        //   this.$store.commit('savesection_deatil',this.sectiondetail)
        // }
          // console.log(this.video_yet)
        //console.log(this.sectiondetail.length)
        if(this.sectiondetail.length===0){
          this.showsection=false
        }
          // console.log(this.video_yet)
          // this.getvideo_monted()
        //  console.log(this.section_c)
        // console.log(this.sectiondetail)
        }else{
          this.$message.error(resp.msg)
        }

      })

    },
    // looksection(item){
    //   this.$store.commit('saveid_section',item)
    //   this.idsection_yet=item
    //   let formdata=new FormData()
    //   formdata.append("id_section",item)
    //   // console.log(this.item)
    //   this.postRequest('/Section/select',formdata).then(resp=>{
    //     if(resp.code===1){
    //       this.id_section=resp.data.id_section
    //       // this.section_c=resp.data.belong_section
    //       // console.log(this.id_section)
    //       this.getvideo()
    //     }else{
    //       this.$message.error(resp.msg)
    //     }
    //   })
    // },
    //改变页面展示数据量方法
    handleSizeChanged(val){
      this.show_s=true
      this.pageNumber=val
    },
    //改变当前页面
    handleCurrentChange(val){
      this.show_s=true
      this.currentPage=val
    },
  },
  mounted() {

    // this.$forceUpdate()

    this.section_c=this.$store.state.section_c
    this.id_course=this.$store.state.id_course
    this.video_yet=this.$store.state.video_yet

    // console.log(this.section_c[0])
    this.count=this.section_c.length
    this.getsection()
    this.sectiondetail=this.$store.state.sectiondetail
    // console.log(this.sectiondetail)
    // this.getvideo_monted()
  },
  // created(){

  // }
}
</script>

<style  lang="less" scoped>
.aside{
  height: 600px;
  //background-color: #faf8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-radius: 15px;
  line-height: normal;
  max-height: 600px;
  overflow: auto;
}
.el-button{

    border: none;
    width: 100%;
    height: 50px;


}
.video{
  height: 600px;
 // background-color: #1cabe7;
 // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  margin-left: 50px;
  max-height: 600px;

}
</style>
