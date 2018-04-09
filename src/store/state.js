import * as util from 'assets/js/util';
const state = {
  course: {},
  userInfo: {},
  userGuid: util.getUserGuid() || '',
  productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
  thirdParty: '',
  thirdPartyInfo: null,
  beforeLoginPage: util.getBeforeLoginPage() || '/info'
}

export default state;
