import * as types from './mutations-types';
import * as util from 'assets/js/util';

const mutations = {
  // Vuex 中的 mutation 非常类似于事件：
  // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
  // 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

  [types.SET_COURSE] (state, course) {
    state.course = course;
  },
  // 记录用户信息
  [types.RECORD_USERINFO] (state, info) {
    var userInfo = Object.assign({}, state.userInfo, info);
    state.userInfo = userInfo;
    util.cookieOperate.setUserInfo(userInfo);
  },
  // 记录用户guid 待废除
  [types.SET_USERGUID] (state, val) {
    state.userGuid = val;
  },
  // 更新用户guid
  [types.UPDATA_USERGUID] (state, val) {
    util.cookieOperate.setUserGuid(val);
    state.userGuid = val;
  },
  // 待废除
  [types.LOGIN_IN] (state, val) {
    util.cookieOperate.setUserGuid(val);
    state.userGuid = val;
  },
  // 清除用户giud
  [types.REMOVE_USERGUID] (state) {
    util.cookieOperate.removeUserGuid();
    state.userGuid = null;
  },
  // 清除用户信息
  [types.REMOVE_USEINFO] (state) {
    util.cookieOperate.removeUserInfo();
    state.userInfo = null;
  },
  // 记录进入登录流程之前的页面路径
  [types.UPDATA_BEFORELOGINPAGE] (state, val) {
    util.cookieOperate.setBeforeLoginPage(val);
    state.beforeLoginPage = val;
  },
  // 记录登录第三方平台名称
  [types.RECORD_THIRDPARTY] (state, val) {
    state.thirdParty = val;
  },
  // 记录登录第三方平台信息
  [types.RECORD_THIRDPARTYINFO] (state, val) {
    state.thirdPartyInfo = val;
  },
  // 记录进入登录流程之前的页面路径 待废除
  [types.SET_BEFORELOGINPAGE] (state, val) {
    state.beforeLoginPage = val;
  }
};

export default mutations;
