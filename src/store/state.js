import * as util from 'assets/js/util';
const debug = process.env.NODE_ENV !== 'production';
const state = {
  course: {},
  userInfo: {},
  userGuid: debug ? (util.getUserGuid() || '') : (util.getUserGuid() || ''),
  productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
  thirdParty: '',
  thirdPartyInfo: null,
  beforeLoginPage: util.getBeforeLoginPage() || '/info'
};

export default state;
