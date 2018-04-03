<template>
  <div class="user-form g-mobilebind">
    <form class="form" data-vv-scope="mobilebind">
      <p class="verify error"></p>
      <ul class="form-main form-hook" v-if="!passsFirst">
        <li class="input-item" :class="{'has-error': errors.has('mobilebind.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'"
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
            <input class="input" v-validate="'required'" type="text" placeholder="请输入验证码" name="verifycode">
            <span class="tipinfo send-hook">
                <em>发送信息</em>
            </span>
          </div>
          <div v-show="errors.has('mobilebind.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span
            class="meg text-danger">{{ errors.first('mobilebind.verifycode')
            }}</span>
          </div>
        </li>
      </ul>
      <ul class="form-main form-hook step-item" v-if="passsFirst && !isLogined">
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
  import { commonVariable, ERR_OK } from 'api/config';
  import { Validator, ErrorBag } from 'vee-validate';
  import * as util from 'assets/js/util';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Confirm from 'base/confirm/confirm';
  import { mapGetters } from 'vuex';
  import { boundMobileVerify, webBoundMobileByThirdPartUid, webRegisterAndBoundMobileByThirdPartUid } from 'api/login';

  export default {
    data () {
      return {
        formName: 'mobilebind',
        isActiving: false,
        btnText: '下一步',
        passsFirst: false,
        operateTip: '',
        isLogined: false
      };
    },
    mounted () {
    },
    computed: {
      ...mapGetters([
        'productGuid'
      ])
    },
    methods: {
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.changeSubmitBtn(true);
            if (!this.passsFirst) {
              this._boundMobileVerify();
            } else if (this.passsFirst && !this.isLogined) {
              this._webRegisterAndBoundMobileByThirdPartUid();
            } else if (this.passsFirst && this.isLogined) {
              this._webBoundMobileByThirdPartUid();
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
      _boundMobileVerify () {
        boundMobileVerify({

        });
      },
      _webBoundMobileByThirdPartUid () {
        webBoundMobileByThirdPartUid({

        });
      },
      _webRegisterAndBoundMobileByThirdPartUid () {
        webRegisterAndBoundMobileByThirdPartUid({

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
  @import "./mobilebind";

</style>
