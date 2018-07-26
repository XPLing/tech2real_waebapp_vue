/**
 * Created by XPL on 2018/3/20.
 */
export let commonParams = {
  productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
  version: 2,
  clientType: 1
};
export let options = {
  param: 'jsonpCallback'
};

export let removePending = (config, obj) => {
  for (let p in obj) {
    if (obj[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      obj[p].f(); //  执行取消操作
      obj.splice(p, 1); //  把这条记录从数组中移除
    }
  }
};

export const ERR_OK = 200;
export const ERR_OK_STR = 'ok';
export const REQUEST_PREFIX = '';

export let thirdParty = {
  wechat: {
    url: 'https://open.weixin.qq.com/connect/qrconnect',
    webUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    reUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    webReUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    appId: 'wxef3355d78cfc7a3d',
    devAppId: 'wxef3355d78cfc7a3d', // "wxa6b9e9095db32224"
    devUri: 'http://open.dev.tech2real.com/m-web/user/mobilebind',
    uri: 'http://open.tech2real.com/m-web/user/mobilebind'
  },
  qq: {
    url: 'https://graph.qq.com/oauth2.0/authorize',
    webUrl: 'https://graph.qq.com/moc2/authorize',
    reUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    webReUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    devAppId: '101367357',
    appId: '101367357',
    devUri: 'http://open.dev.tech2real.com/m-web/user/mobilebind',
    uri: 'http://open.tech2real.com/m-web/user/mobilebind'
  },
  weibo: {
    url: 'https://api.weibo.com/oauth2/authorize',
    webUrl: 'https://open.weibo.cn/oauth2/authorize',
    reUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    webReUrl: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    devAppId: '182034898',
    appId: '182034898',
    devUri: 'http://open.dev.tech2real.com/m-web/user/mobilebind',
    uri: 'http://open.dev.tech2real.com/m-web/user/mobilebind'
  }
};
