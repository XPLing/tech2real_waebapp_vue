import * as types from './mutations-types';
import { setUserGuid, getUserGuid, getProductGuid } from 'assets/js/common';

const mutations = {
  // Vuex 中的 mutation 非常类似于事件：
  // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
  // 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
  [types.SET_COURSE] (state, course) {
    state.course = course;
  },
  [types.RECORD_USERINFO] (state, info) {
    state.user = Object.assign({}, state.user, info);
    setUserGuid(info.id);
  },
  [types.SET_USERGUID] (state) {
    state.userGuid = getUserGuid();
  }
};

export default mutations;
