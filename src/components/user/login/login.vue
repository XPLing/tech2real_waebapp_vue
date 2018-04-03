<template>
  <div class="g-login user-form">
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
      <form-tip-error :tip-name="'login.totalMsg'"></form-tip-error>
      <div class="btnbox">
        <button type="button" class="submit submit-hook needsclick" :class="{'disable':isActiving}"
                @click="validateForm('login')">{{btnText}}
        </button>
      </div>
    </form>
    <p class="forget-pw">
      <router-link tag="a" to="/user/backpw">忘记密码？</router-link>
    </p>
    <div class="vendor">
      <div class="titlebox">
        <span class="line"></span>
        <span class="name">使用社交账号登录</span>
        <span class="line"></span>
      </div>
      <div class="btnbox row third-party-hook">
        <p class="wechat">
          <i class="fa fa-weixin needsclick" data-type="wechat" @click="thirdPartLogin('qq')"></i>
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
  import { mapState, mapMutations } from 'vuex';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import * as util from 'assets/js/util';
  export default {
    data () {
      return {
        phone: '',
        password: '',
        userInfo: null,
        isActiving: false,
        btnText: '登录',
        formName: 'login'
      };
    },
    mounted () {

    },
    methods: {
      ...mapMutations({
        recordUserinfo: 'RECORD_USERINFO',
        setUserguid: 'SET_USERGUID'
      }),
      _login () {
        this.changeSubmitBtn(true, '登录中...');
        var data = {
          mobile: this.phone.trim(),
          password: this.password.trim()
        };
        webLoginByPhone(data).then((res) => {
          if (res.code == ERR_OK) {
            this.changeSubmitBtn(false, '登录');
            this.recordUserinfo({
              logined: true,
              id: '873441c5-be2c-4d90-a4cc-b05c184b99cf'
            });
            this.setUserguid();
            this.$router.back();
          } else {
            this.changeSubmitBtn(false, '登录');
            util.formErrorMsg({
              errorObj: this.errors,
              name: 'totalMsg',
              message: res.message,
              rule: undefined,
              scope: this.formName,
              interval: 2000
            });
          }
        }, (error) => {
          this.changeSubmitBtn(false, '登录');
          util.formErrorMsg({
            errorObj: this.errors,
            name: 'totalMsg',
            message: error.message,
            rule: undefined,
            scope: this.formName,
            interval: 2000
          });
        });
      },
      thirdPartLogin(type){
        switch (type){
          case 'qq':

              break;
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this._login();
          }
        }, (erro) => {
          console.log(erro);
        });
      },
      changeSubmitBtn (flag, text) {
        if (flag !== null) {
          this.isActiving = flag;
        }
        if (text) {
          this.btnText = text;
        }
      }
    },
    components: {
      FormTipError
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "../form";
  @import "./login";

</style>
