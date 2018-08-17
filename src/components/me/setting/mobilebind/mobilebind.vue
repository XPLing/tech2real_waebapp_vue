<template>
  <div>
    <header class="g-header">
      <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
    </header>
    <div class="user-form g-mobilebind">

      <form class="form" data-vv-scope="mobilebind">
        <p class="verify error"></p>
        <ul class="form-main form-hook step-item">
          <li class="input-item verify-code" :class="{'has-error': errors.has('mobilebind.verifycode') }">
            <div class="main">
              <i class="icon">验证码</i>
              <input class="input" v-model="verifycode" v-validate="'required'" type="text" placeholder="请输入验证码"
                     name="verifycode">
              <send-msg @startsend="startSend" ref="sendMsg"></send-msg>
            </div>
            <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
              <i class="icon fa fa-warning text-danger"></i><span
              class="meg text-danger">{{ errors.first('mobilebind.verifycode')}}</span>
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
      <top-tip ref="toptip" :is-auto-hide="topTipAutoHide">
        <p class="error" v-show="toptipTxt">
          <span v-html="toptipTxt"></span>
        </p>
      </top-tip>
      <confirm :isDialog="true" :text="operateTip" ref="confirm" @confirm="confirm"></confirm>
    </div>
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
    webBoundMobileByThirdPartUid,
    webLoginByThirdPartCode,
    getResetPwdAuthCode,
    boundMobileByThirdPartUid
  } from 'api/login';

  export default {
    data () {
      return {
        pageTitle: '硬见|智慧连接硬件创新',
        formName: 'mobilebind',
        isActiving: false,
        btnText: '确定',
        passsFirst: false,
        operateTip: '',
        isRegistered: false,
        phone: '',
        verifycode: '',
        password: '',
        toptipTxt: '',
        loginError: false,
        topTipAutoHide: false,
        routerPrefix: util.routerPrefix
      };
    },
    mounted () {
    },
    created () {
      this.thirdPartVerify().then((res) => {
        this._boundMobileVerify().then((resp) => {
          this.changeSubmitBtn(false);
          this.$nextTick(() => {
            if (resp.code == ERR_OK) {
              this.operateTip = resp.message;
              this.$refs.confirm.show();
              this.$refs.sendMsg.send();
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
      }, error => {

      });
      this.regiterFinish = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userInfo',
        'thirdParty',
        'thirdPartyInfo',
        'beforeLoginPage'
      ])
    },
    methods: {
      ...mapMutations({
        recordThirdParty: 'RECORD_THIRDPARTY',
        recordThirdPartyInfo: 'RECORD_THIRDPARTYINFO'
      }),
      ...mapActions([
        'updateUserInfo'
      ]),
      startSend () {
        this._boundMobileVerify().then((response) => {
          var res = response;
          if (res.code == ERR_OK) {
            this.operateTip = res.message;
            this.$refs.confirm.show();
            this.$refs.sendMsg.send();
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
      },
      confirm () {
        if (!this.isRegistered && this.regiterFinish) {
          this.$router.replace('/user/login');
        }
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            this._boundMobileByThirdPartUid().then((resp) => {
              this.changeSubmitBtn(false);
              if (resp.code == ERR_OK) {
                this.updateUserInfo(resp.result);
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
            var userInfo = res.result;
            this.recordThirdPartyInfo(userInfo);
            var browser = util.common.getbrowserType();
            var isWechat = browser >= 1 && browser < 2;
            if (isWechat) {
              util.cookieOperate.setWeChatOpenGuid(false);
            }
            if (res.code == 201) {
              return Promise.resolve(res);
            }
          } else {
            this.$nextTick(() => {
              this.toptipTxt = res.message;
              this.loginError = true;
              this.$refs.toptip.show();
            });
            return Promise.reject(res);
          }
        }).catch(error => {
          this.$nextTick(() => {
            this.topTipAutoHide = true;
            this.toptipTxt = error.message;
            this.$refs.toptip.show();
          });
          return Promise.reject(error);
        });
      },
      _getResetPwdAuthCode () {
        return getResetPwdAuthCode({
          product_guid: this.productGuid,
          mobile: this.userInfo.mobile
        });
      },
      _boundMobileVerify () {
//        return Promise.resolve({
//          code: 200, message: '验证码已发送', result: -1
//        });
        return boundMobileVerify({
          product_guid: this.productGuid,
          mobile: this.userInfo.mobile,
          third_party: this.thirdParty
        });
      },
      _boundMobileByThirdPartUid () {
        var uidName = '';
        switch (this.thirdParty){
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
          mobile: this.userInfo.mobile,
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
        switch (this.thirdparty){
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
          mobile: this.userInfo.mobile,
          uid: this.thirdPartyInfo[this.thirdParty][uidName],
          thirdParty: this.thirdParty,
          nickname: this.thirdPartyInfo[this.thirdParty].nickname,
          code: this.verifycode
        };
        return webBoundMobileByThirdPartUid(param);
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
          param.redirectUri = thirdParty.qq.bindUri;
        } else if (thirdparty == 'sina') {
          param.redirectUri = thirdParty.weibo.bindUri + '?thridparty=sina';
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
  @import "./form";
  @import "./mobilebind";

</style>
