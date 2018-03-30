<template>
  <div class="user-form g-backpw">
    <form class="form" data-vv-scope="backpw">
      <p class="verify error"></p>
      <ul class="form-main form-hook active">
        <li class="input-item" :class="{'has-error': errors.has('backpw.phone') }">
          <div class="main">
            <i class="icon">手机号</i>
            <input name="phone" v-validate="'required|phone'"
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
            <input class="input" v-validate="'required'" type="text" placeholder="请输入验证码" name="verifycode"
                   :class="{'input': true}">
            <span class="tipinfo send-hook">
                <em>发送信息</em>
            </span>
          </div>
          <div v-show="errors.has('backpw.verifycode')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i><span class="meg text-danger">{{ errors.first('backpw.verifycode')
            }}</span>
          </div>
        </li>
        <li class="input-item"  :class="{'has-error': errors.has('backpw.password')}">
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
        <li class="input-item"  :class="{'has-error': errors.has('backpw.confirmPW')}">
          <div class="main">
            <i class="icon">确认密码</i>
            <input type="password" placeholder="确认密码" name="confirmPW"
                   v-validate="'required|confirmed:backpw.password'"
                   :class="{'input': true, 'has-error': errors.has('confirmPW')}">
            <i class="fa fa-exclamation-circle tipinfo"></i>
          </div>
          <div v-show="errors.has('backpw.confirmPW')" class="c-tip error">
            <i class="icon fa fa-warning text-danger"></i>
            <span class="meg text-danger">{{ errors.first('backpw.confirmPW')}}</span>
          </div>
        </li>
      </ul>
      <div class="btnbox">
        <button type="button" class="submit submit-hook" @click="validateForm('backpw')">重置密码</button>
      </div>
    </form>
    <p class="c-tip t-r">
      <router-link tag="a" to="/user/login">返回登录</router-link>
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import { commonVariable, ERR_OK } from 'api/config';

  export default {
    data () {
      return {
        'password': ''
      };
    },
    mounted () {
    },
    methods: {
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          console.log(res);
          console.log('Form Submitted!');
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
  @import "../form";
  @import "./backpw";
</style>
