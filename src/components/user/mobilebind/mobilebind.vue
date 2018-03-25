<template>
  <div class="g-mobilebind">
      <form class="form">
          <p class="verify error"></p>
          <ul class="form-main form-hook active">
              <li class="input-item verify-code">
                  <div class="main">
                      <i class="icon">验证码</i>
                      <input class="input" type="text" placeholder="请输入验证码"  data-key="verifycode">
                      <span class="tipinfo send-hook">
                                    <em>发送信息</em>
                                </span>
                  </div>
                  <p class="c-tip error"></p>
              </li>
              <li class="input-item">
                  <div class="main">
                      <i class="icon">手机号</i>
                      <input class="input" type="text" placeholder="请输入手机号"  data-key="mobile">
                      <i class="fa fa-exclamation-circle tipinfo"></i>
                  </div>
                  <p class="c-tip error"></p>
              </li>
          </ul>
          <div class="c-shadow-local active" id="msgLocal">
              <p class="item msg"></p>
          </div>
          <div class="btnbox">
              <button type="button" class="submit submit-hook">绑定</button>
          </div>
      </form>
      <p class="c-tip t-r"><a href="/login_page">返回登录</a></p>
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
  @import "./mobilebind";

</style>
