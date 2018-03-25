<template>
    <div class="g-user">
        <header class="g-header">
            <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
            <TabLogin></TabLogin>
        </header>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import HeaderTitle from 'components/header-title/header-title';
    import TabLogin from 'components/user/tab-login/tab-login';
    import {commonVariable, ERR_OK} from 'api/config';
    export default {
        data(){
            return {
                pageTitle: "硬见 | 智慧连接硬件创新",
                hasBack: true
            }
        },
        mounted(){
        },
        components: {
            TabLogin,
            HeaderTitle
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "~assets/scss/compile";
    @import "./user";

</style>
