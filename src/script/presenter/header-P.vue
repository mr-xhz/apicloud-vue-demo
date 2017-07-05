<template lang="html">
  <div :style="{height:height}">
    <div :style="{paddingTop:paddingTop}" class="header">
      这个是头部 {{title}}
    </div>
  </div>
</template>

<script>
import $api from '@U/api'
export default {
  props:[
    "title"
  ],
  data(){
    return {
      paddingTop:"0px",
      height:"0.88rem"
    }
  },
  mounted(){
    $api.ready(()=>{
      this.paddingTop = $api.statusBarHeight() + "px";
      this.height = $api.headerHeight()+"px";
    });
  },
  methods:{
  }
}
</script>

<style lang="scss">
  .header{
    height:0.88rem;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
  }
</style>
