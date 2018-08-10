<template>
  <transition name="slide">
    <div class="g-reset-pw">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <form data-vv-scope="resetPWForm">
              <template v-if="!isPWValidate">
                <div class="c-inline">
                  <div class="main-cont">
                    <div class="left">
                      密码
                    </div>
                    <div class="right">
                      <input type="password" v-model="password" name="password"
                             v-validate="{ required: true}" key="old-pw">
                    </div>
                  </div>
                  <div v-show="errors.has('resetPWForm.password')" class="c-tip error">
                    <i class="icon fa fa-warning text-danger"></i>
                    <span class="meg text-danger">{{ errors.first('resetPWForm.password')}}</span>
                  </div>
                  <p class="tip">为保障您的账号安全，在修改密码前请填写原密码</p>
                </div>
              </template>
              <template v-else="">
                <div class="c-inline">
                  <div class="main-cont">
                    <div class="left limit">
                      新密码
                    </div>
                    <div class="right">
                      <input type="password" v-model="newPassword" name="password"
                             v-validate="{ required: true}" ey="new-pw">
                    </div>
                  </div>
                  <div v-show="errors.has('resetPWForm.password')" class="c-tip error">
                    <i class="icon fa fa-warning text-danger"></i>
                    <span class="meg text-danger">{{ errors.first('resetPWForm.password')}}</span>
                  </div>
                </div>
                <div class="c-inline">
                  <div class="main-cont">
                    <div class="left limit">
                      确认密码
                    </div>
                    <div class="right">
                      <input type="password" name="confirmPW" key="new-pw-confirm"
                             v-validate="'required|confirmed:password'">
                    </div>
                  </div>
                  <div v-show="errors.has('resetPWForm.confirmPW')" class="c-tip error">
                    <i class="icon fa fa-warning text-danger"></i>
                    <span class="meg text-danger">{{ errors.first('resetPWForm.confirmPW')}}</span>
                  </div>
                </div>
              </template>

              <form-tip-error :tip-name="'resetPWForm.totalMsg'"></form-tip-error>
              <button class="confirm-btn" @click.prevent="validateForm('resetPWForm')">{{btnText}}</button>
            </form>

          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapActions } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import NoResult from 'base/no-result/no-result';
  import { getPrivileged, resetUserPassWord } from 'api/account';
  import { Validator, ErrorBag } from 'vee-validate';
  import FormTipError from 'base/form-tip-error/form-tip-error';

  export default {
    data () {
      return {
        pageTitle: '修改密码',
        isRouterAlive: true,
        toptipTxt: '',
        password: '',
        newPassword: '',
        formName: 'resetPWForm',
        isActiving: false,
        btnText: '确认',
        isPWValidate: false
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
    },
    methods: {
      formSubmit () {
        var fnName = '';
        if (this.isPWValidate) {
          fnName = '_resetUserPassWord';
        } else {
          fnName = '_getPrivileged';
        }
        this[fnName]().then((res) => {
          if (res.status === ERR_OK_STR) {
            this.changeSubmitBtn(false, '确认');
            if (this.isPWValidate) {
              this.updateUserInfo(res.results.user);
              this.$router.back();
            } else {
              this.isPWValidate = true;
            }
          } else {
            this.changeSubmitBtn(false, '确认');
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
          this.changeSubmitBtn(false, '确认');
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
            this.changeSubmitBtn(true, '提交中...');
            this.formSubmit();
          }
        }, (erro) => {
          console.log(erro);
        });
      },
      ...mapActions([
        'updateUserInfo'
      ]),
      _resetUserPassWord () {
        var param = {
          password: this.newPassword,
          version: 1,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return resetUserPassWord(param);
      },
      _getPrivileged () {
        var param = {
          password: this.password,
          version: 1,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return getPrivileged(param);
      }
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      Confirm,
      TopTip,
      Loading,
      Scroll,
      NoResult,
      FormTipError
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./resetPW";
</style>
