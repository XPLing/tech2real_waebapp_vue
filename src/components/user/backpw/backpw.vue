<template>
  <div class="user-form g-backpw">
    <form class="form" data-vv-scope="backpw">
      <p class="verify error"></p>
      <ul class="form-main">
        <li class="input-item" :class="{'has-error': errors.has('backpw.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-model="phone" v-validate="'required|phone'"
                   :class="{'input': true}" type="text"
                   placeholder="请输入手机号">
          </div>
          <div v-show="errors.has('backpw.phone')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span class="meg text-danger">{{ errors.first('backpw.phone')
            }}</span>
          </div>
        </li>
        <li class="input-item verify-code" :class="{'has-error': errors.has('backpw.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-validate="'required'" v-model="verifycode" type="text" placeholder="请输入验证码"
                   name="verifycode"
                   :class="{'input': true}">
            <send-msg @startsend="startSend" ref="sendMsg"></send-msg>
          </div>
          <div v-show="errors.has('backpw.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('backpw.verifycode')
            }}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('backpw.password')}">
          <div class="main">
            <i class="icon">设置密码</i>
            <input name="password" type="password" placeholder="输入6-16位密码"
                   v-validate="{rules:{required: true,pw:true}}" v-model="password"
                   :class="{'input': true, 'has-error': errors.has('password')}">
          </div>
          <div v-show="errors.has('backpw.password')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i>
            <span class="meg text-danger">{{ errors.first('backpw.password')}}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('backpw.confirmPW')}">
          <div class="main">
            <i class="icon">确认密码</i>
            <input type="password" placeholder="确认密码" name="confirmPW"
                   v-validate="'required|confirmed:password'"
                   :class="{'input': true, 'has-error': errors.has('confirmPW')}">
          </div>
          <div v-show="errors.has('backpw.confirmPW')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i>
            <span class="meg text-danger">{{ errors.first('backpw.confirmPW')}}</span>
          </div>
        </li>
      </ul>
      <form-tip-error :tip-name="'backpw.totalMsg'"></form-tip-error>
      <div class="btnbox">
        <button type="button" class="submit submit-hook" @click="validateForm('backpw')">重置密码</button>
      </div>
    </form>
    <confirm :isDialog="true" :text="operateTip" ref="confirm" @confirm="confirm"></confirm>
    <p class="c-tip t-r">
      <router-link tag="a" to="/user/login">返回登录</router-link>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { commonVariable, ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { getResetPwdAuthCode, resetPwdByAuthCode } from 'api/login';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Confirm from 'base/confirm/confirm';
  import SendMsg from 'base/send-msg/send-msg';
  import { Validator, ErrorBag } from 'vee-validate';
  import { mapGetters } from 'vuex';

  export default {
    data () {
      return {
        password: '',
        operateTip: '',
        formName: 'backpw',
        phone: '',
        verifycode: '',
        isActiving: false,
        confirmType: ''
      };
    },
    computed: {
      ...mapGetters([
        'productGuid'
      ])
    },
    mounted () {
    },
    methods: {
      confirm () {
        switch (this.confirmType) {
          case 'submit':
            this.$router.replace('/user/login');
            break;
        }
      },
      startSend () {
        this.$validator.validate('backpw.phone', this.phone).then((result) => {
          if (result) {
            this._getResetPwdAuthCode().then((response) => {
              var res = response;
              if (res.code == ERR_OK) {
                this.operateTip = res.message;
                this.$refs.confirm.show();
                this.$refs.sendMsg.send();
              } else {
                util.formErrorMsg({
                  errorObj: this.errors,
                  name: 'totalMsg',
                  message: res.message,
                  rule: undefined,
                  scope: this.formName,
                  interval: 2000
                });
              }
            }, error => {
              util.formErrorMsg({
                errorObj: this.errors,
                name: 'totalMsg',
                message: error.message,
                rule: undefined,
                scope: this.formName,
                interval: 2000
              });
            });
          }
        });
      },
      _getResetPwdAuthCode () {
        return getResetPwdAuthCode({
          product_guid: this.productGuid,
          mobile: this.phone
        });
      },
      _resetPwdByAuthCode () {
        return resetPwdByAuthCode({
          product_guid: this.productGuid,
          mobile: this.phone,
          password: this.password,
          code: this.verifycode
        });
      },
      changeSubmitBtn (flag, text) {
        if (flag !== null) {
          this.isActiving = flag;
        }
        if (text) {
          this.btnText = text;
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            this._resetPwdByAuthCode().then((response) => {
              var res = response;
              this.changeSubmitBtn(false);
              if (res.code == ERR_OK) {
                this.operateTip = res.message;
                this.confirmType = 'submit';
                this.$refs.confirm.show();
              } else {
                util.formErrorMsg({
                  errorObj: this.errors,
                  name: 'totalMsg',
                  message: res.message,
                  rule: undefined,
                  scope: this.formName,
                  interval: 2000
                });
              }

            }, error => {
              this.changeSubmitBtn(false);
              util.formErrorMsg({
                errorObj: this.errors,
                name: 'totalMsg',
                message: error.message,
                rule: undefined,
                scope: this.formName,
                interval: 2000
              });
            });
          }
        }, (erro) => {
          console.log('Form erro!');
        });
      }
    },
    components: {
      HeaderTitle,
      FormTipError,
      Confirm,
      SendMsg
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "../form";
  @import "./backpw";
</style>
