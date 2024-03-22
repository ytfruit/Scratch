
<template>
  <div>
  <el-row>
    <el-col :span="24" style="height:600px;overflow: visible">
      <el-descriptions direction="vertical" :column="1" border>
        <el-descriptions-item label="ID">{{sectionData.id_section}}</el-descriptions-item>
        <el-descriptions-item label="章节">{{sectionData.title}}</el-descriptions-item>
        <el-descriptions-item label="介绍">{{sectionData.description}}</el-descriptions-item>
        <el-descriptions-item label="发布者">{{sectionData.creater}}</el-descriptions-item>
        <el-descriptions-item label="视频">
          <el-upload style="float: left"
                     ref="upload"
                     :auto-upload="false"
                     :drag="true"
                     action=""
                     :on-change="submitload"
                     :http-request="upload"
                     :disabled="isDisabled"
                   >
            <i class="el-icon-close" @click="handleRemove" style="margin-left: 95vh"></i>
            <p><i class="el-icon-camera" v-if="video===''"></i></p>
            <span v-if="video===''">最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
            <video type="video/mp4" id="sound" class="video-js"  :src="video"  preload="auto" :auto-play="false"  v-if="video!==''" controls muted>
              您的浏览器不支持video标签
            </video>
            <el-progress :percentage="progressPercent" v-if="videoflag"></el-progress>
          </el-upload>
        </el-descriptions-item>
      </el-descriptions>
          <el-button type="primary" @click="handleDelete">删除</el-button>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import Video from "@/views/Teachers/Class/Video.vue";
import videojs from "video.js";
import Player from "@/views/Teachers/Class/Player.vue";
var video = () => {
  var videoTime = document.getElementById("my-player");
  console.log(videoTime.duration); //获取视频时长
  console.log(videoTime.currentTime); //获取视频当前播放时间
};

export default {
  name:'Section',
  components: {Video},
  data(){
    return{
      count:0,
      currentPage:1,
      pageSize:8,
      sectionData:{},
      id_section:1,
      show_progress:false,
      video:'',
      videoflag:false,
      progressPercent:0,
      isDisabled:true,
    }
  },
  methods:{
    handleRemove(file, fileList) {
      this.isDisabled = true
      // console.log(this.isDisabled)
      this.$confirm(`确定移除视频？`)
          .then(() => {
            this.video = ''
            this.isDisabled = false
          })
          .catch(() => { })
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    async submitload(){
      this.$refs.upload.submit();
      this.show_progress=true
      // console.log(this.$refs.upload.submit())
    },
    upload(file){
      // console.log(file)
      this.video=file.file
      const config = {
        "onUploadProgress": progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(0))
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.videoflag=true
      let formdata=new FormData()
      formdata.append("id_section",this.id_section)
      formdata.append('video',this.video)
      this.postRequest('/file/upload/video',formdata,{config}).then(resp=>{
        if(resp){
          this.$message.success("上传成功！")
          this.getvideo()
        }else{
          this.$message.error("上传失败，请重试")
        }
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    getvideo(){
      this.id_section=this.$store.state.id_section
      // console.log(this.id_section)
      let formdata=new FormData()
      formdata.append("id_section",this.id_section)
      // const params = new URLSearchParams(formdata)
      // console.log(this.id_section)
      this.getRequest('http://localhost:8080/file/download/video',{},{params:{id_section:this.id_section},responseType: 'blob'}).then(resp => {
        if (resp.size!==0) {
          // console.log(header)
            let blob=new Blob([resp],{type: "video/mp4"})
            this.video=window.URL.createObjectURL(blob)
            // console.log(this.video)
            this.isDisabled=true
            this.videoflag = false
          }else if(resp.size===0){
            this.isDisabled = false
          // console.log(this.isDisabled)
        }
      })
    },
   async getsectionData(){
      this.id_section=this.$store.state.id_section
      let formdata=new FormData();
      formdata.append('id_section',this.id_section)
      this.postRequest('/Section/select',formdata).then(resp=>{
        if(resp.code===1){
          this.sectionData=resp.data;
          // this.getvideo()
          // console.log(this.classData)
        }
        else{
          this.$message.error(resp.msg)
        }
      })
    },
    handleDelete(){
      this.id_section=this.$store.state.id_section
        const formData = new FormData();
        formData.append("id_section",this.id_section)
      // console.log(this.id_section)
        this.$confirm("确定删除该章节吗,该操作不可逆！！！", "删除提示", {
          confirmButtonText: '确定删除',
          cancelButtonText: '算了,留着',
          type: 'danger'
        }).then(() => { //确认删除
          this.postRequest('/Section/delete',formData).then(res => {
            if (res.code===1) {
              this.$router.replace('/teachers/video')
              this.$message({type: 'success', message: '删除成功！'})
            }else{
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
        })
    }
  },
  mounted() {
    this.getsectionData()
    this.getvideo()
  },
}
</script>


<style scoped lang="less">
.look-video:hover{
  background-color: #cba6a6;
}

</style>
