<template>
  <div class="g-user">
    <header class="g-header">
      <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
      <TabLogin :tab-list="tabList"></TabLogin>
    </header>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import TabLogin from 'components/tab-login/tab-login';
  import { commonVariable, ERR_OK } from 'api/config';

  const LOGINNAME = '登录';
  const REGISTERNAME = '注册';
  const MOBILEBINDNAME = '绑定手机号';
  const BACKPWNAME = '找回密码';
  const LOGINPATH = '/user/login';
  const REGISTERPATH = '/user/register';
  const BACKPWPATH = '/user/backpw';
  const MOBILEBINDPATH = '/user/mobilebind';
  const ROUTER_LOGINREGISTER = [
    {
      name: LOGINNAME,
      path: LOGINPATH
    },
    {
      name: REGISTERNAME,
      path: REGISTERPATH
    }
  ];
  const ROUTER_PARH = [
    {
      path: BACKPWPATH,
      data: [
        {
          name: BACKPWNAME,
          path: BACKPWPATH
        }
      ]

    },
    {
      path: MOBILEBINDPATH,
      data: [
        {
          name: MOBILEBINDNAME,
          path: MOBILEBINDPATH
        }
      ]
    }
  ];

  export default {
    data () {
      return {
        pageTitle: '硬见 | 智慧连接硬件创新',
        hasBack: true,
        tabList: ROUTER_LOGINREGISTER
      };
    },
    beforeRouteUpdate (to, from, next) {
      var currentPath = to.fullPath;
      this.setTabList(currentPath);
      next();
    },
    beforeRouteLeave (to, from, next) {
      next();
    },
    created () {
      var currentPath = this.$router.currentRoute.fullPath;
      this.setTabList(currentPath);
    },
    mounted () {

    },
    methods: {
      setTabList (currentPath) {

        if (currentPath === REGISTERPATH || currentPath === LOGINPATH) {
          this.tabList = ROUTER_LOGINREGISTER;
          return;
        }
        for (var i = 0, len = ROUTER_PARH.length; i < len; i++) {
          var item = ROUTER_PARH[i];
          var path = item.path;
          if (currentPath === path) {
            this.tabList = item.data;
            break;
          }
        }
      }
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
