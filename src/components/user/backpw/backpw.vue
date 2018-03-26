<template>
  <div class="g-backpw">
      <form class="form">
          <p class="verify error"></p>
          <ul class="form-main form-hook active">
              <li class="input-item">
                  <div class="main">
                      <i class="icon">手机号</i>
                      <input class="input" type="text" placeholder="请输入手机号" data-key="mobile">
                      <i class="fa fa-exclamation-circle tipinfo"></i>
                  </div>
                  <p class="c-tip error"></p>
              </li>
              <li class="input-item verify-code">
                  <div class="main">
                      <i class="icon">验证码</i>
                      <input class="input" type="text" placeholder="请输入验证码" data-key="verifycode">
                      <span class="tipinfo send-hook">
                                    <em>发送信息</em>
                                </span>
                  </div>
                  <p class="c-tip error"></p>
              </li>
              <li class="input-item">
                  <div class="main">
                      <i class="icon">设置密码</i>
                      <input class="input" type="password" placeholder="输入6-16位密码" data-key="pw">
                      <i class="fa fa-exclamation-circle tipinfo"></i>
                  </div>
                  <p class="c-tip error"></p>
              </li>
              <li class="input-item">
                  <div class="main">
                      <i class="icon">确认密码</i>
                      <input class="input" type="password" placeholder="确认密码" data-key="confirm-pw">
                      <i class="fa fa-exclamation-circle tipinfo"></i>
                  </div>
                  <p class="c-tip error"></p>
              </li>
          </ul>
          <div class="btnbox">
              <button type="button" class="submit submit-hook">重置密码</button>
          </div>
      </form>
      <p class="c-tip t-r"><a href="login.html">返回登录</a></p>
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
  @import "./backpw";
</style>
