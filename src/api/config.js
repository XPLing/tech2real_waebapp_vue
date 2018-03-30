/**
 * Created by XPL on 2018/3/20.
 */
export let commonParams = {
    productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b'
}
export let commonVariable = {
  productGuid: 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
  userGuid: ''
}
export let options = {
    param: 'jsonpCallback'
}

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
