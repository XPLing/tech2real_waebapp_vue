<template>
  <div class="user-form g-mobilebind">
    <form class="form" data-vv-scope="mobilebind">
      <p class="verify error"></p>
      <ul class="form-main form-hook active">
        <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-validate="'required'" type="text" placeholder="请输入验证码" name="verifycode"
                   :class="{'input': true}">
            <span class="tipinfo send-hook">
                <em>发送信息</em>
            </span>
          </div>
          <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span class="meg text-danger">{{ errors.first('mobilebind.verifycode')
            }}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('mobilebind.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'"
                   :class="{'input': true}" type="text"
                   placeholder="请输入手机号">
          </div>
          <div v-show="errors.has('mobilebind.phone')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span class="meg text-danger">{{ errors.first('mobilebind.phone')
            }}</span>
          </div>
        </li>
      </ul>
      <div class="c-shadow-local active" id="msgLocal">
        <p class="item msg"></p>
      </div>
      <div class="btnbox">
        <button type="button" class="submit submit-hook" @click="validateForm('mobilebind')">绑定</button>
      </div>
    </form>
    <p class="c-tip t-r">
      <router-link tag="a" to="/user/login">返回登录</router-link>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { commonVariable, ERR_OK } from 'api/config';
  import { Validator } from 'vee-validate';

  export default {
    data () {
      return {
        pageTitle: '登录'
      };
    },
    mounted () {
    },
    methods: {
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          console.log(res);
          console.log('Form Submitted!');
        }, (erro) => {
          console.log('Form erro!');
        });
      }
    },
    components: {
      HeaderTitle
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "../form";
  @import "./mobilebind";

</style>
