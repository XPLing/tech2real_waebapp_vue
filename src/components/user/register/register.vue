<template>
  <div class="g-register">
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
            <span class="tipinfo send-hook">
                <em>发送信息</em>
            </span>
          </div>
          <div v-show="errors.has('registerFirst.verifycode')" class="c-tip error">
            <i class="icon fa fa-exclamation-circle text-danger"></i><span
            class="meg text-danger">{{ errors.first('registerFirst.verifycode')
            }}</span>
          </div>
        </li>
      </ul>
      <div class="btnbox">
        <button type="button" class="submit submit-hook needsclick" data-type="register-next"
                @click="validateForm('registerFirst')">下一步
        </button>
      </div>
    </form>
    <p class="c-tip t-c">点击注册表示您同意<a class="protocol"
                                     href="https://m.tech2real.com/html/license/license.html?product_guid=a5c72d76-16dc-4bb6-b6af-f2e562b1839b">用户协议</a>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { commonVariable, ERR_OK } from 'api/config';
  import { Validator } from 'vee-validate';

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
        passsFirst: false
      };
    },
    mounted () {
    },
    methods: {
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          console.log(res);
          if (res) {
            this.passsFirst = true;
            console.log('Form Submitted!');
          }
        }, (erro) => {
          console.log('Form erro!');
        });
      }
    },
    components: {
      HeaderTitle
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./register";

</style>
