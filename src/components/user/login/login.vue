<template>
  <div class="g-login">
        <header class="g-header">
          <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
        </header>
        <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-login/header-login';
  import { commonVariable, ERR_OK } from 'api/config';
  export default {
    data(){
      return {
        pageTitle: "登录",
        hasBack: true
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
  @import "./login";

</style>
