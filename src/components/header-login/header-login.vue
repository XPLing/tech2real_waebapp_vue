<template>
  <div class="g-header-title">
    <i class="fa fa-angle-left back back-hook"></i>
    <div class="brand">
      <a href="#" class="brand-logo yj-icon-logo"></a>
    </div>
    <div class="tag">
      <div class="row">
        <a href="login.html" class="col-xs-6 item">
          <p>登录</p>
          <i class="icon active fa fa-caret-up"></i>
        </a>
        <a href="register.html" class="col-xs-6 item">
          <p>注册</p>
          <i class="icon fa fa-caret-up"></i>
        </a>
      </div>
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
  @import "./header-login";

</style>
