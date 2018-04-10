<template>
  <div class="user-form g-mobilebind">
    <top-tip ref="toptip" :is-auto-hide="topTipAutoHide">
      <p class="error" v-show="toptipTxt">
        <span v-html="toptipTxt"></span>
        <router-link v-show="loginError" to="/user/login" tag="a" replace>请重新登录！</router-link>
      </p>
    </top-tip>
    <p class="avatar" v-if="thirdPartyInfo && thirdPartyInfo.headimgurl">
      <img :src="thirdPartyInfo.headimgurl" :alt="thirdPartyInfo.nickname">
    </p>
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
            <send-msg @startsend="startSend" ref="sendMsgRegister"></send-msg>
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
      this.regiterFinish = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'thirdParty',
        'thirdPartyInfo',
        'beforeLoginPage'
      ])
    },
    methods: {
      ...mapMutations({
        recordThirdParty: 'RECORD_THIRDPARTY',
        recordThirdPartyInfo: 'RECORD_THIRDPARTYINFO',
        recordUserinfo: 'RECORD_USERINFO',
        setUserguid: 'SET_USERGUID',
        updataUserGuid: 'UPDATA_USERGUID'
      }),
      startSend () {
        this.$validator.validate('backpw.phone', this.phone).then((result) => {
          if (result) {
            this._getResetPwdAuthCode().then((response) => {
              var res = response;
              if (res.code == ERR_OK) {
                var dom = 'sendMsg';
                if (!this.isLogined) {
                  dom = 'sendMsgRegister';
                }
                this.operateTip = res.message;
                this.$refs.confirm.show();
                this.$refs[dom].send();
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
        if (!this.isLogined && this.regiterFinish) {
          this.$router.replace('/user/login');
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            if (!this.passsFirst) {
              this._boundMobileVerify().then((resp) => {
                this.passsFirst = true;
                this.changeSubmitBtn(false);
                this.$nextTick(() => {
                  if (resp.code == ERR_OK) {
                    this.operateTip = resp.message;
                    this.$refs.confirm.show();
                    this.$refs.sendMsgRegister.send();
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
                });
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
                  this.regiterFinish = true;
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
                  var userGuid = '873441c5-be2c-4d90-a4cc-b05c184b99cf';
                  this.updataUserGuid(userGuid);
                  this.$router.push({
                    path: util.getBeforeLoginPage()
                  });
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
      thirdPartVerify () {
        this._webLoginByThirdPartCode().then((res) => {
          if (res.code == ERR_OK || res.code == 201) {
            this.recordThirdPartyInfo(res.result);
            if (res.code == 201) {
              if (util.getbrowserType === 1) {
                util.cookieOperate.setWechatOpenID(false);
              }
              return;
            }
            if (util.getbrowserType === 1) {
              util.cookieOperate.setWechatOpenID(true);
            }
            util.setUserGuid('873441c5-be2c-4d90-a4cc-b05c184b99cf');
            this.$router.push({
              path: this.beforeLoginPage
            });
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
//        return Promise.resolve({
//          code: 200, message: '验证码已发送', result: -1
//        });
        return boundMobileVerify({
          product_guid: this.productGuid,
          mobile: this.phone,
          third_party: this.thirdParty
        });
      },
      _webBoundMobileByThirdPartUid () {
        return webBoundMobileByThirdPartUid({
          mobile: this.phone,
          uid: this.thirdPartyInfo.unionid,
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo.nickname,
          code: this.verifycode
        });
      },
      _webRegisterAndBoundMobileByThirdPartUid () {
        return webRegisterAndBoundMobileByThirdPartUid({
          mobile: this.phone,
          uid: this.thirdPartyInfo.unionid,
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo.nickname,
          faceHash: this.thirdPartyInfo.faceHash,
          code: this.verifycode,
          password: this.password
        });
      },
      _webLoginByThirdPartCode () {
//        this.recordThirdParty('weixin');
//        return Promise.resolve({
//          'code': '200',
//          'message': '微信未绑定账号，跳转至绑定界面',
//          'result': {
//            'country': 'GI',
//            'unionid': 'oEnVnwpEB20jhlYQBNCP8B8L9hes',
//            'province': '',
//            'city': '',
//            'openid': 'oalmz0SINMKcyLeN_MXT56v_xCnw',
//            'sex': 0,
//            'nickname': '槑',
//            'headimgurl': 'http://thirdwx.qlogo.cn/mmopen/vi_32/uOBOz3lgzh1gXQudxx2vQsRnPU8K1ctj14SImvsROCBRBjU09qK1jvVKREonRuo707xnkcD9zgm9KZud8xuQhw/132',
//            'language': 'zh_CN',
//            'privilege': [],
//            'faceHash': 'Fhfn6hH83dOtYZz9PGQ2-F0mZHli'
//          },
//          'success': true
//        });

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
        var code = util.getUrlParameter('code', url, '&');
        var param = {};
        param.productGuid = this.productGuid;
        param.thirdParty = thirdparty;
        param.code = code;
        this.recordThirdParty(thirdparty);
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
