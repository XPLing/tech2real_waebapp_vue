<template>
  <div class="g-login">
        <header class="g-header">
          <HeaderTitle :title="pageTitle"></HeaderTitle>
        </header>
        <router-link to="/train/67">detail</router-link>
        <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { commonVariable, ERR_OK } from 'api/config';
  export default {
    data(){
      return {
        pageTitle: "登录"
      }
    },
    mounted(){
    },
    components: {
      HeaderTitle
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./register";

</style>
