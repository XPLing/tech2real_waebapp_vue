<template>
  <div class="g-tab-login">
    <div class="tag">
        <router-link class="item" to="/user/login">
            <p>登录</p>
            <i class="icon fa fa-caret-up"></i>
        </router-link>
        <router-link class="item" to="/user/register">
            <p>注册</p>
            <i class="icon fa fa-caret-up"></i>
        </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {
      back(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./tab-login";

</style>
