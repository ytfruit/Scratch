<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name:"app",
  created(){
    if(sessionStorage.getItem('store')){
      this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem('store'))))
    }
    window.addEventListener('beforeunload',()=>{
      sessionStorage.setItem('store',JSON.stringify(this.$store.state))
    })
  }

}
</script>

<style>
.body{
  margin:0;
  padding: 0;
  height: 100%;
}
#app{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
}
</style>
