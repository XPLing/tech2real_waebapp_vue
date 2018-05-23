import * as util from 'assets/js/util';
const debug = process.env.NODE_ENV !== 'production';
const state = {
  course: {},
  userInfo: util.cookieOperate.getUserInfo() || null,
  userGuid: debug ? (util.cookieOperate.getUserGuid() || '') : (util.cookieOperate.getUserGuid() || ''),
  productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
  thirdParty: '',
  thirdPartyInfo: null,
  beforeLoginPage: util.cookieOperate.getBeforeLoginPage() || '/info'
};

export default state;
