<template>
  <div class="g-register user-form">
    <form class="form" data-vv-scope="registerFirst">
      <input type="hidden" id="userGuid">
      <p class="verify error"></p>
      <ul class="form-main form-hook step-item user-hook active" v-if="!passsFirst">
        <li class="input-item" :class="{'has-error': errors.has('registerFirst.nickname')}">
          <div class="main">
            <i class="icon">昵&nbsp;&nbsp;&nbsp;&nbsp;称</i>
            <input type="text" placeholder="请输入昵称" name="nickname"
                   v-validate="'required|nickname'" v-model="nickname"
                   :class="{'input': true, 'has-error': errors.has('registerFirst.nickname') }">
            <!--<i class="fa fa-exclamation-circle tipinfo"></i>-->
          </div>
          <div v-show="errors.has('registerFirst.nickname')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i>
            <span class="meg text-danger">{{ errors.first('registerFirst.nickname')}}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('registerFirst.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'" v-model="phone"
                   :class="{'input': true, 'has-error': errors.has('registerFirst.phone') }" type="text"
                   placeholder="请输入手机号">
          </div>
          <div v-show="errors.has('registerFirst.phone')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i>
            <span class="meg text-danger">{{ errors.first('registerFirst.phone')}}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('registerFirst.password')}">
          <div class="main">
            <i class="icon">设置密码</i>
            <input name="password" type="password" placeholder="输入6-16位密码"
                   v-validate="{rules:{required: true,pw:true}}" v-model="password"
                   :class="{'input': true, 'has-error': errors.has('registerFirst.password')}">
          </div>
          <div v-show="errors.has('registerFirst.password')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i>
            <span class="meg text-danger">{{ errors.first('registerFirst.password')}}</span>
          </div>
        </li>
        <li class="input-item" :class="{'has-error': errors.has('registerFirst.confirmPW')}">
          <div class="main">
            <i class="icon">确认密码</i>
            <input type="password" placeholder="确认密码" name="confirmPW"
                   v-validate="'required|confirmed:password'"
                   :class="{'input': true, 'has-error': errors.has('registerFirst.confirmPW')}">
            <!--<i class="fa fa-exclamation-circle tipinfo"></i>-->
          </div>
          <div v-show="errors.has('registerFirst.confirmPW')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i>
            <span class="meg text-danger">{{ errors.first('registerFirst.confirmPW')}}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item verifycode-hook" v-if="passsFirst">
        <li class="input-item verify-code" :class="{'has-error': errors.has('registerFirst.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" type="text" placeholder="请输入验证码" name="verifycode" key="verifycode"
                   v-validate="'required'" v-model="verifycode" :class="{'input': true}">
          </div>
          <div v-show="errors.has('registerFirst.verifycode')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i><span
            class="meg text-danger">{{ errors.first('registerFirst.verifycode')}}</span>
          </div>
        </li>
      </ul>
      <!--<div v-show="errors.has('registerFirst.totalMsg')" class="c-shadow-local">
        <p class="msg">{{ errors.first('registerFirst.totalMsg')}}</p>
      </div>-->
      <form-tip-error :tip-name="'registerFirst.totalMsg'"></form-tip-error>
      <div class="btnbox">
        <button type="button" class="submit submit-hook needsclick" data-type="register-next"
                @click="validateForm('registerFirst')" :class="{'disable':isActiving}">{{btnText}}
        </button>
      </div>
    </form>
    <confirm :isDialog="true" :text="operateTip" ref="confirm" @confirm="confirm"></confirm>
    <p class="c-tip t-c">点击注册表示您同意<a class="protocol"
                                     href="https://m.tech2real.com/html/license/license.html?product_guid=a5c72d76-16dc-4bb6-b6af-f2e562b1839b">用户协议</a>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { registerByPhone, authRegisterByPhone } from 'api/login';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Confirm from 'base/confirm/confirm';
  import { Validator, ErrorBag } from 'vee-validate';
  import { mapGetters } from 'vuex';

  const validateErrorBag = new ErrorBag();
  //  const dictionary = {
  //    zh_CN: {
  //      messages: {
  //        confirmed: () => '两次密码输入不一致!!!'
  //      }
  //    }
  //  };
  //  Validator.updateDictionary(dictionary);
  export default {
    data () {
      return {
        password: '',
        verifycode: '',
        nickname: '',
        phone: '',
        passsFirst: false,
        operateTip: '',
        formName: 'registerFirst',
        isActiving: false,
        btnText: '下一步'
      };
    },
    computed: {
      ...mapGetters([
        'productGuid'
      ])
    },
    methods: {
      confirm () {
        if (!this.passsFirst) {
          this.passsFirst = true;
          this.changeSubmitBtn(false, '注册');
        } else {
          this.changeSubmitBtn(false);
          this.$router.replace('/user/login');
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            let type = '_registerByPhone', getUserGuid = true;
            if (this.passsFirst) {
              type = '_authRegisterByPhone';
              getUserGuid = false;
            }
            this[type]().then((res) => {
              var result = res.results;
              if (res.status === ERR_OK_STR) {
                this.operateTip = result.message;
                if (getUserGuid) {
                  this.userGuid = result.user.guid;
                }
                this.$refs.confirm.show();
              } else {
                this.changeSubmitBtn(false);
                util.formErrorMsg({
                  errorObj: this.errors,
                  name: 'totalMsg',
                  message: result.message,
                  rule: undefined,
                  scope: this.formName,
                  interval: 2000
                });
              }
            }, (error) => {
              console.log(error);
              util.formErrorMsg({
                errorObj: this.errors,
                name: 'totalMsg',
                message: '请求出错，请联系管理员！',
                rule: undefined,
                scope: this.formName,
                interval: 2000
              });
            });
          }
        }, (erro) => {
          console.log('Form erro!');
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
      _registerByPhone () {
        return registerByPhone({
          product_guid: this.productGuid,
          phone: this.phone,
          password: this.password,
          nickname: this.nickname
        });
      },
      _authRegisterByPhone () {
        return authRegisterByPhone({
          product_guid: this.productGuid,
          auth_code: this.verifycode,
          user_guid: this.userGuid
        });
      }
    },
    components: {
      HeaderTitle,
      FormTipError,
      Confirm
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "../form";
  @import "./register";

</style>
