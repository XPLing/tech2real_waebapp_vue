<template>
    <div class="g-login">
        <form class="form">
            <p class="verify error"></p>
            <ul class="form-main form-hook">
                <li class="input-item">
                    <div class="main">
                        <i class="icon c-icon-mobile"></i>
                        <input name="phone" v-model="phone" v-validate.initial="'required|phone'"
                               :class="{'input': true, 'is-danger': errors.has('phone') }" type="text"
                               placeholder="手机号">
                        <i v-show="errors.has('phone')" class="fa fa-warning"></i>
                        <span v-show="errors.has('phone')" class="help is-danger">{{ errors.first('phone') }}</span>
                    </div>
                    <p class="c-tip error"></p>
                </li>
                <li class="input-item">
                    <div class="main">
                        <i class="icon c-icon-pw"></i>
                        <input class="input" type="password" placeholder="密码" name="mobile" data-key="pw">
                    </div>
                    <p class="c-tip error"></p>
                </li>
            </ul>
            <div class="btnbox">
                <button type="button" class="submit submit-hook">登录</button>
            </div>
        </form>
        <p class="forget-pw"><a href="find_back_pw.html">忘记密码？</a></p>
        <div class="vendor">
            <div class="titlebox">
                <span class="line"></span>
                <span class="name">使用社交账号登录</span>
                <span class="line"></span>
            </div>
            <div class="btnbox row third-party-hook">
                <p class="wechat">
                    <i class="fa fa-weixin" data-type="wechat"></i>
                </p>
                <p class="qq">
                    <i class="fa fa-qq" data-type="qq" id="QQLoginBtn"></i>
                </p>
                <p class="weibo">
                    <i class="fa fa-weibo" data-type="weibo"></i>
                </p>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { commonVariable, ERR_OK } from 'api/config';
    import {Validator} from 'vee-validate';
    export default {
        data(){
            return {
                phone: ''
            }
        },
        mounted(){
        },
        components: {}
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "~assets/scss/compile";
    @import "./login";

</style>
