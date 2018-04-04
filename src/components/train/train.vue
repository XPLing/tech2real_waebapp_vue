<template>
  <div class="g-train">
        <header class="g-header">
          <HeaderTitle :title="pageTitle"></HeaderTitle>
        </header>
        <router-link to="/train/67">detail</router-link>
        <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  export default {
    data(){
      return {
        pageTitle: "培训"
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
  @import "./train";

</style>
