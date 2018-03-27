<template>
  <div class="g-login">
    <form class="form" data-vv-scope="login">
      <p class="verify error"></p>
      <ul class="form-main form-hook">
        <li class="input-item" :class="{'has-error': errors.has('login.phone') }">
          <div class="main">
            <i class="icon c-icon-mobile"></i>
            <input class="needsclick" name="phone" v-model="phone" v-validate:phone="'required|phone'" data-vv-as="手机号"
                   :class="{'input': true}" type="text"
                   placeholder="手机号">
          </div>
          <div v-show="errors.has('login.phone')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span class="meg text-danger">{{ errors.first('login.phone')
            }}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('login.password') }">
          <div class="main">
            <i class="icon c-icon-pw"></i>
            <input class="needsclick" name="password" v-model="password" v-validate="'required|pw'" data-key="pw"
                   :class="{'input': true}" type="password"
                   placeholder="密码">
          </div>
          <div v-show="errors.has('login.password')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('login.password')}}</span>
          </div>
        </li>
      </ul>
      <div class="btnbox">
        <button type="button" class="submit submit-hook needsclick" @click="validateForm('login')">登录</button>
      </div>
    </form>
    <p class="forget-pw"><a href="find_back_pw.html">忘记密码？</a></p>
    <div class="vendor">
      <div class="titlebox">
        <span class="line"></span>
        <span class="name">使用社交账号登录</span>
        <span class="line"></span>
      </div>
      <div class="btnbox row third-party-hook">
        <p class="wechat">
          <i class="fa fa-weixin" data-type="wechat"></i>
        </p>
        <p class="qq">
          <i class="fa fa-qq" data-type="qq" id="QQLoginBtn"></i>
        </p>
        <p class="weibo">
          <i class="fa fa-weibo" data-type="weibo"></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { commonVariable, ERR_OK } from 'api/config';
  import { Validator } from 'vee-validate';
  import { webLoginByPhone } from 'api/login';

  export default {
    data () {
      return {
        phone: '',
        password: ''
      };
    },
    mounted () {

    },
    methods: {
      _login () {
        var data = {
          mobile: this.phone.trim(),
          password: this.password.trim()
        };
        webLoginByPhone(data).then((res) => {
          console.log(res);
        });
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          this._login();
        }, (erro) => {
          console.log(erro);
        });
      },
      formSubmitSuccess () {

      }
    },
    components: {}
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./login";

</style>
