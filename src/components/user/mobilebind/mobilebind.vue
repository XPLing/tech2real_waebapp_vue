<template>
  <div class="user-form g-mobilebind">
    <top-tip ref="toptip" :is-auto-hide="topTipAutoHide">
      <p class="error" v-show="toptipTxt">
        <span v-html="toptipTxt"></span>
        <router-link v-show="loginError" to="/user/login" tag="a" replace>请重新登录！</router-link>
      </p>

    </top-tip>
    <form class="form" data-vv-scope="mobilebind">
      <p class="verify error"></p>
      <ul class="form-main form-hook" v-if="!passsFirst">
        <li class="input-item" :class="{'has-error': errors.has('mobilebind.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'" v-model="phone"
                   :class="{'input': true}" type="text"
                   placeholder="请输入手机号">
          </div>
          <div v-show="errors.has('mobilebind.phone')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.phone')
            }}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item" v-if="passsFirst && isLogined">
        <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-model="verifycode" v-validate="'required'" type="text" placeholder="请输入验证码"
                   name="verifycode">
            <send-msg @startsend="startSend" ref="sendMsg"></send-msg>
          </div>
          <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.verifycode')
            }}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item" v-if="passsFirst && !isLogined">
        <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-model="verifycode" v-validate="'required'" type="text" placeholder="请输入验证码"
                   name="verifycode">
            <send-msg @startsend="startSend" ref="sendMsg"></send-msg>
          </div>
          <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.verifycode')
            }}</span>
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
      <form-tip-error :tip-name="'mobilebind.totalMsg'"></form-tip-error>
      <div class="btnbox">
        <button type="button" class="submit submit-hook needsclick" data-type="register-next"
                @click="validateForm('mobilebind')" :class="{'disable':isActiving}">{{btnText}}
        </button>
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
  import { ERR_OK, thirdParty } from 'api/config';
  import { Validator, ErrorBag } from 'vee-validate';
  import * as util from 'assets/js/util';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Confirm from 'base/confirm/confirm';
  import TopTip from 'base/top-tip/top-tip';
  import { mapGetters, mapMutations } from 'vuex';
  import SendMsg from 'base/send-msg/send-msg';
  import {
    boundMobileVerify,
    webBoundMobileByThirdPartUid,
    webRegisterAndBoundMobileByThirdPartUid,
    webLoginByThirdPartCode,
    getResetPwdAuthCode
  } from 'api/login';

  export default {
    data () {
      return {
        formName: 'mobilebind',
        isActiving: false,
        btnText: '下一步',
        passsFirst: false,
        operateTip: '',
        isLogined: false,
        phone: '',
        verifycode: '',
        password: '',
        toptipTxt: '',
        loginError: false,
        topTipAutoHide: false
      };
    },
    mounted () {
    },
    created () {
      this.thirdPartVerify();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'thirdParty',
        'thirdPartyInfo'
      ])
    },
    methods: {
      ...mapMutations({
        recordThirdParty: 'RECORD_THRIDPARTY',
        recordThirdPartyInfo: 'RECORD_THRIDPARTYINFO'
      }),
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
      confirm () {
        if (!this.isLogined) {
          this.$router.replace('/user/login');
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            if (!this.passsFirst) {
              this._boundMobileVerify().then((resp) => {
                this.changeSubmitBtn(false);
                if (resp.code == ERR_OK) {
                  this.passsFirst = true;
                  if (resp.result != -1) {
                    this.isLogined = true;
                  }
                } else {
                  util.formErrorMsg({
                    errorObj: this.errors,
                    name: 'totalMsg',
                    message: resp.message,
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
            } else if (this.passsFirst && !this.isLogined) {
              this._webRegisterAndBoundMobileByThirdPartUid().then((resp) => {
                this.changeSubmitBtn(false);
                if (resp.code == ERR_OK) {
                  this.operateTip = resp.message;
                  this.$refs.confirm.show();
                } else {
                  util.formErrorMsg({
                    errorObj: this.errors,
                    name: 'totalMsg',
                    message: resp.message,
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
            } else if (this.passsFirst && this.isLogined) {
              this._webBoundMobileByThirdPartUid().then((resp) => {
                this.changeSubmitBtn(false);
                if (resp.code == ERR_OK) {
                  this.$router.go(-2);
                } else {
                  util.formErrorMsg({
                    errorObj: this.errors,
                    name: 'totalMsg',
                    message: resp.message,
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
      thirdPartVerify: function () {
        this._webLoginByThirdPartCode().then((res) => {
          if (res.code == ERR_OK) {
            this.recordThirdPartyInfo(res.result);
            if (util.getbrowserType === 1) {
              util.cookieOperate.setWechatOpenID('webChatOpenID', true);
            }
            if (res.code === 201) {
              return false;
            }
            this.$router.go(-2);
          } else {
            this.$nextTick(() => {
              this.toptipTxt = res.message;
              this.loginError = true;
              this.$refs.toptip.show();
            });
          }
        }, error => {
          this.$nextTick(() => {
            this.topTipAutoHide = true;
            this.toptipTxt = error.message;
            this.$refs.toptip.show();
          });
        });
      },
      _getResetPwdAuthCode () {
        return getResetPwdAuthCode({
          product_guid: this.productGuid,
          mobile: this.phone
        });
      },
      _boundMobileVerify () {
        boundMobileVerify({
          product_guid: this.productGuid,
          mobile: this.phone,
          third_party: this.thirdParty
        });
      },
      _webBoundMobileByThirdPartUid () {
        webBoundMobileByThirdPartUid({
          mobile: this.phone,
          uid: this.thirdPartyInfo.uid,
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo.nickname,
          code: this.verifycode
        });
      },
      _webRegisterAndBoundMobileByThirdPartUid () {
        return webRegisterAndBoundMobileByThirdPartUid({
          mobile: this.phone,
          uid: this.thirdPartyInfo.uid,
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo.nickname,
          faceHash: this.thirdPartyInfo.faceHash,
          code: this.verifycode
        });
      },
      _webLoginByThirdPartCode () {
        var url = decodeURIComponent(window.location.hash);
        if (url.indexOf('?') < 0) {
          this.$nextTick(() => {
            this.loginError = true;
            this.$refs.toptip.show();
          });
          return Promise.reject({
            message: '请求出错'
          });
        }
        url = url.split('?')[1];
        var thirdparty = util.getUrlParameter('thridparty', url, '&');
        this.recordThirdParty(thirdparty);
        var code = util.getUrlParameter('code', url, '&');
        var param = {};
        param.productGuid = this.productGuid;
        param.thirdParty = thirdparty;
        param.code = code;
        if (thirdparty == 'qq') {
          param.redirectUri = thirdParty.qq.uri;
        } else if (thirdparty == 'sina') {
          param.redirectUri = thirdParty.weibo.uri + '?thridparty=sina';
        }
        return webLoginByThirdPartCode(param);
      }
    },
    components: {
      HeaderTitle,
      FormTipError,
      Confirm,
      SendMsg,
      TopTip
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "../form";
  @import "./mobilebind";

</style>
