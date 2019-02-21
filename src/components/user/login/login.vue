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
                   placeholder="手机号" @blur="inputBlur($event)">
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
                   placeholder="密码" @blur="inputBlur($event)">
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
      <router-link tag="a" :to="{path: routerPrefix + '/user/backpw'}">忘记密码？</router-link>
    </p>
    <div class="vendor">
      <div class="titlebox">
        <span class="line"></span>
        <span class="name">使用社交账号登录</span>
        <span class="line"></span>
      </div>
      <div class="btnbox row third-party-hook">
        <p class="wechat">
          <i class="fa fa-weixin needsclick" data-type="wechat" @click="thirdPartLogin('weixin')"
             ref="thirdPartyWechat"></i>
        </p>
        <p class="qq">
          <i class="fa fa-qq" data-type="qq" id="QQLoginBtn" @click="thirdPartLogin('qq')"></i>
        </p>
        <p class="weibo">
          <i class="fa fa-weibo" data-type="weibo" @click="thirdPartLogin('sina')"></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { thirdParty, ERR_OK } from 'api/config';
  import { Validator } from 'vee-validate';
  import { webLoginByPhone } from 'api/login';
  import { mapMutations, mapGetters, mapActions } from 'vuex';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import * as util from 'assets/js/util';

  export default {
    inject: ['setTabList'],
    data () {
      return {
        phone: '',
        password: '',
        userInfo: null,
        isActiving: false,
        btnText: '登录',
        formName: 'login',
        routerPrefix: util.routerPrefix,
        scrollTop: 5
      };
    },
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        var $this = vm;
        var toPath = to.fullPath;
        var fromPath = from.fullPath;
        var isUser = false;

        for (var i = 0, len = from.matched.length; i < len; i++) {
          var item = from.matched[i];
          var name = item.name;
          if (name === 'user') {
            isUser = true;
            break;
          }
        }
        if (!isUser) {
          vm.$store.commit('UPDATA_BEFORELOGINPAGE', fromPath);
        }
        return true;
      });
    },
    created () {
      var currentPath = this.$router.currentRoute.fullPath;
      this.setTabList(currentPath);
    },
    mounted () {
      setTimeout(() => {
        var browser = util.common.getbrowserType();
        var isWechat = browser >= 1 && browser < 2;
        if (isWechat) {
          if (util.cookieOperate.getWeChatOpenGuid()) {
            this.$refs.thirdPartyWechat.click();
          }
        }
      }, 20);
    },
    computed: {
      ...mapGetters([
        'beforeLoginPage',
        'systemInfo'
      ])
    },
    methods: {
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
      thirdPartLogin (type) {
        var url = '', uri = '', href = '';
        var uriKey = 'uri', appIdKey = 'appId', currentUrl = window.location.href;
        if (/open.dev./.test(currentUrl)) {
          uriKey = 'devUri';
          appIdKey = 'devAppId';
        }
        switch (type) {
          case 'weixin':
            url = thirdParty.wechat.url;
            uri = encodeURIComponent(thirdParty.wechat[uriKey] + '?thridparty=weixin');
            if (util.browser.versions.mobile) {
              url = thirdParty.wechat.webUrl;
            }
            href = url + '?appid=' + thirdParty.wechat[appIdKey] + '&redirect_uri=' + uri + '&response_type=code&scope=snsapi_userinfo&state=' + util.uuid(8, 16) + '#wechat_redirect';
            break;
          case 'qq':
            url = thirdParty.qq.url;
            uri = encodeURIComponent(thirdParty.qq[uriKey] + '?thridparty=qq');
            href = url + '?client_id=' + thirdParty.qq[appIdKey] + '&redirect_uri=' + uri + '&response_type=code&scope=get_user_info&state=' + util.uuid(8, 16);
            /*  if (util.browser.mobile) {
                url = thirdParty.qq.webUrl;
                href = url + "?client_id=" + thirdParty.qq[appIdKey] + "&redirect_uri=" + uri + "display=mobile&response_type=code&scope=get_user_info&state=" + util.uuid(8, 16);
            } */
            break;
          case 'sina':
            url = thirdParty.weibo.url;
            uri = encodeURIComponent(thirdParty.weibo[uriKey] + '?thridparty=sina');
            if (util.browser.versions.mobile) {
              url = thirdParty.weibo.webUrl;
            }
            href = url + '?client_id=' + thirdParty.weibo[appIdKey] + '&response_type=code&scope=all&state=' + util.uuid(8, 16) + '&redirect_uri=' + uri;
            break;
        }
        window.location.href = href;
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
      },
      _login () {
        this.changeSubmitBtn(true, '登录中...');
        var data = {
          mobile: this.phone.trim(),
          password: this.password.trim()
        };
        webLoginByPhone(data).then((res) => {
          if (res.code == ERR_OK) {
            this.changeSubmitBtn(false, '登录');
            this.signIn(res.result);
            this.$router.replace({
              path: this.beforeLoginPage
            });
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
      ...mapActions([
        'signIn'
      ]),
      ...mapMutations({
          updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
      })
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
