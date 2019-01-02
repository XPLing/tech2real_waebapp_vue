<template>
  <div class="user-form g-mobilebind">
    <top-tip ref="toptip" :is-auto-hide="topTipAutoHide">
      <p class="error" v-show="toptipTxt">
        <span v-html="toptipTxt"></span>
        <router-link v-show="loginError" :to="{path: routerPrefix + '/user/login'}" tag="a" replace>请重新登录！</router-link>
      </p>
    </top-tip>
    <transition name="fade">
      <div class="base-info" v-if="thirdPartyInfo[thirdParty] && thirdPartyInfo[thirdParty].userAvatar">
        <p class="avatar">
          <img :src="thirdPartyInfo[thirdParty].userAvatar"
               :alt="thirdPartyInfo[thirdParty].nickname || thirdPartyInfo[thirdParty].name">
        </p>
        <p class="name">{{thirdPartyInfo[thirdParty].nickname || thirdPartyInfo[thirdParty].name}}</p>
      </div>
    </transition>

    <form class="form" data-vv-scope="mobilebind">
      <p class="verify error"></p>
      <ul class="form-main form-hook" v-if="!passsFirst">
        <li class="input-item" :class="{'has-error': errors.has('mobilebind.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'" v-model="phone"
                   :class="{'input': true}" type="text" @blur="inputBlur($event)"
                   placeholder="请输入手机号">
          </div>
          <div v-show="errors.has('mobilebind.phone')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.phone')
            }}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item" v-if="passsFirst && isRegistered">
        <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-model="verifycode" v-validate="'required'" type="text" placeholder="请输入验证码"
                   name="verifycode" @blur="inputBlur($event)">
            <send-msg @startsend="startSend" ref="sendMsg"></send-msg>
          </div>
          <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.verifycode')
            }}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item" v-if="passsFirst && !isRegistered">
        <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
          <div class="main">
            <i class="icon">验证码</i>
            <input class="input" v-model="verifycode" v-validate="'required'" type="text" placeholder="请输入验证码"
                   name="verifycode" @blur="inputBlur($event)">
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
                   :class="{'input': true, 'has-error': errors.has('registerFirst.password')}"
                   @blur="inputBlur($event)">
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
                   :class="{'input': true, 'has-error': errors.has('registerFirst.confirmPW')}"
                   @blur="inputBlur($event)">
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
      <router-link tag="a" :to="{path: routerPrefix + '/user/login'}">返回登录</router-link>
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
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import SendMsg from 'base/send-msg/send-msg';
  import {
    boundMobileVerify,
    boundMobileByThirdPartUid,
    webBoundMobileByThirdPartUid,
    webRegisterAndBoundMobileByThirdPartUid,
    webLoginByThirdPartCode,
    getResetPwdAuthCode
  } from 'api/login';

  export default {
    inject: ['setTabList'],
    beforeRouteEnter (to, from, next) {
      var currentPath = to.fullPath;
      console.log(currentPath);
      this.setTabList(currentPath);
      next();
    },
    data () {
      return {
        formName: 'mobilebind',
        isActiving: false,
        btnText: '下一步',
        passsFirst: false,
        operateTip: '',
        isRegistered: false,
        phone: '',
        verifycode: '',
        password: '',
        toptipTxt: '',
        loginError: false,
        topTipAutoHide: false,
        routerPrefix: util.routerPrefix,
        scrollTop: 5,
        blurTimer: null
      };
    },
    mounted () {

    },
    created () {
      var currentPath = this.$router.currentRoute.fullPath;
      this.setTabList(currentPath);
      this.thirdPartVerify();
      this.regiterFinish = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'thirdParty',
        'thirdPartyInfo',
        'beforeLoginPage',
        'systemInfo'
      ])
    },
    methods: {
      ...mapMutations({
        recordThirdParty: 'RECORD_THIRDPARTY',
        recordThirdPartyInfo: 'RECORD_THIRDPARTYINFO'
      }),
      ...mapActions([
        'signIn'
      ]),
      inputBlur (event) {
        if (this.systemInfo.type() !== 1.2) {
          return;
        }
        if (this.blurTimer) {
          clearTimeout(this.blurTimer);
        }
        this.blurTimer = setTimeout(() => {
          var activeElement = document.activeElement;
          var isEqual = activeElement.isEqualNode(event.target),
            isInput = /input|textarea/.test(activeElement.tagName.toLocaleLowerCase());
          if (!isEqual && !isInput) {
            document.body.scrollTop += ++this.scrollTop;
          }
        }, 300);
      },
      startSend () {
        this.$validator.validate('mobilebind.phone', this.phone).then((result) => {
          if (result) {
            this._boundMobileVerify().then((response) => {
              var res = response;
              if (res.code == ERR_OK) {
                var dom = 'sendMsg';
                if (!this.isRegistered) {
                  dom = 'sendMsgRegister';
                }
                this.operateTip = res.message;
                this.$refs.confirm.show();
                this.$refs[dom].send();
              } else {
                util.common.formErrorMsg({
                  errorObj: this.errors,
                  name: 'totalMsg',
                  message: res.message,
                  rule: undefined,
                  scope: this.formName,
                  interval: 2000
                });
              }
            }, error => {
              util.common.formErrorMsg({
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
        if (!this.isRegistered && this.regiterFinish) {
          this.$router.replace('/user/login');
        }
      },
      validateForm (scope) {
        if (this.isActiving) {
          return false;
        }
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            if (!this.passsFirst) {
              this._boundMobileVerify().then((resp) => {
                this.passsFirst = true;
                this.changeSubmitBtn(false);
                if (resp.code == ERR_OK) {
                  this.operateTip = resp.message;
                  this.$refs.confirm.show();
                  if (resp.result != -1) {
                    this.isRegistered = true;
                    this.$nextTick(() => {
                      this.$refs.sendMsg.send();
                    });
                  } else {
                    this.$nextTick(() => {
                      this.$refs.sendMsgRegister.send();
                    });
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
            } else if (this.passsFirst && !this.isRegistered) {
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
            } else if (this.passsFirst && this.isRegistered) {
              this._boundMobileByThirdPartUid().then((resp) => {
                this.changeSubmitBtn(false);
                if (resp.code == ERR_OK) {
                  this.signIn(resp.result);
                  this.$router.push({
                    path: util.cookieOperate.getBeforeLoginPage()
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
        return this._webLoginByThirdPartCode().then((res) => {
          if (res.code == ERR_OK || res.code == 201) {
            var userInfo = Object.assign({}, res.result, {
              userAvatar: res.result.headimgurl || res.result.figureurl_qq_2 || res.result.avatar_hd
            });
            this.recordThirdPartyInfo(userInfo);
            var browser = util.common.getbrowserType();
            var isWechat = browser >= 1 && browser < 2;
            if (isWechat) {
              util.cookieOperate.setWeChatOpenGuid(false);
            }
            if (res.code == 201) {
              if (this.thirdParty === 'weixin') {
                userInfo.wxOpenid = this.thirdPartyInfo[this.thirdParty].openid;
              }
              return;
            }
            this.signIn(userInfo);
            this.$router.push({
              path: this.beforeLoginPage
            });

          } else {
            this.loginError = true;
            this.$nextTick(() => {
              this.toptipTxt = res.message;

              this.$refs.toptip.show();
            });
            return Promise.reject(res);
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
      _boundMobileByThirdPartUid () {
        var uidName = '';
        switch (this.thirdParty) {
          case 'weixin':
            uidName = 'unionid';
            break;
          case 'qq':
            uidName = 'openid';
            break;
          case 'sina':
            uidName = 'openid';
            break;
        }
        var param = {
          mobile: this.phone,
          uid: this.thirdPartyInfo[this.thirdParty][uidName],
          third_party: this.thirdParty,
          product_guid: this.productGuid,
          nickname: this.thirdPartyInfo[this.thirdParty].nickname,
          code: this.verifycode
        };
        return boundMobileByThirdPartUid(param);
      },
      _webBoundMobileByThirdPartUid () {
        var uidName = '';
        switch (this.thirdParty) {
          case 'weixin':
            uidName = 'unionid';
            break;
          case 'qq':
            uidName = 'openid';
            break;
          case 'sina':
            uidName = 'openid';
            break;
        }
        var param = {
          mobile: this.phone,
          uid: this.thirdPartyInfo[this.thirdParty][uidName],
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo[this.thirdParty].nickname,
          code: this.verifycode
        };
        return webBoundMobileByThirdPartUid(param);
      },
      _webRegisterAndBoundMobileByThirdPartUid () {
        var uidName = '';
        switch (this.thirdParty) {
          case 'weixin':
            uidName = 'unionid';
            break;
          case 'qq':
            uidName = 'openid';
            break;
          case 'sina':
            uidName = 'uid';
            break;
        }
        var param = {
          mobile: this.phone,
          uid: this.thirdPartyInfo[this.thirdParty][uidName],
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo[this.thirdParty].nickname,
          faceHash: this.thirdPartyInfo[this.thirdParty].faceHash,
          code: this.verifycode,
          password: this.password
        };
        return webRegisterAndBoundMobileByThirdPartUid(param);
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

        var url = decodeURIComponent(window.location.search);
        if (!url) {
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
