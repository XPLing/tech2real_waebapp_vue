import * as types from './mutations-types';
import * as util from 'assets/js/util';

const mutations = {
  // Vuex 中的 mutation 非常类似于事件：
  // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
  // 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
  [types.SET_COURSE] (state, course) {
    state.course = course;
  },
  [types.RECORD_USERINFO] (state, info) {
    state.user = Object.assign({}, state.user, info);
  },
  [types.SET_USERGUID] (state, val) {
    state.userGuid = val;
  },
  [types.UPDATA_USERGUID] (state, val) {
    util.cookieOperate.setUserGuid(val);
    state.userGuid = val;
  },
  [types.LOGIN_IN] (state, val) {
    util.cookieOperate.setUserGuid(val);
    state.userGuid = val;
  },
  [types.LOGIN_OUT] (state) {
    util.cookieOperate.removeUserGuid();
    state.userGuid = null;
  },
  [types.UPDATA_BEFORELOGINPAGE] (state, val) {
    util.cookieOperate.setBeforeLoginPage(val);
    state.beforeLoginPage = val;
  },
  [types.RECORD_THIRDPARTY] (state, val) {
    state.thirdParty = val;
  },
  [types.RECORD_THIRDPARTYINFO] (state, val) {
    state.thirdPartyInfo = val;
  },
  [types.SET_BEFORELOGINPAGE] (state, val) {
    state.beforeLoginPage = val;
  }
};

export default mutations;
