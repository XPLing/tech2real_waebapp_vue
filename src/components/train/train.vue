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

  export default {
    data(){
      return {
        pageTitle: "培训"
      }
    },
    components: {
      HeaderTitle
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./train";

</style>
