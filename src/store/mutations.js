import * as types from './mutations-types';

const mutations = {
  // Vuex 中的 mutation 非常类似于事件：
  // 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
  // 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
  [types.SET_COURSE] (state, course) {
    state.course = course;
  },
  [types.SET_USER] (state, info) {
    state.user = [...state.user, info];
  }
};

export default mutations;
