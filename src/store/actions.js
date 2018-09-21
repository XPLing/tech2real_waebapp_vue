import * as types from './mutations-types';
import * as util from 'assets/js/util';

// let action = {
//   handler: () => {},
//   updateUserInfo ({commit, state}, data) {
//     commit(types.RECORD_USERINFO, data);
//     commit(types.UPDATA_USERGUID, data.guid);
//   }
// };
//
// export default action;

export let updateUserInfo = function ({commit, sFtate}, data) {
  commit(types.RECORD_USERINFO, data);
  commit(types.UPDATA_USERGUID, data.guid);
};
export let signIn = function ({commit, state}, data) {
  commit(types.RECORD_USERINFO, data);
  commit(types.UPDATA_USERGUID, data.guid);
};
export let signOut = function ({commit, state}) {
  commit(types.REMOVE_USEINFO);
  commit(types.REMOVE_USERGUID);
};
