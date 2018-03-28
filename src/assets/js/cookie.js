/**
 * 设置cookie
 * @param {[type]} key   [键名]
 * @param {[type]} value [键值]
 * @param {[type]} time  [保存的时间（小时）]
 */

export function setCookie (key, value, time) {
  if (!value) {
    removeCookie(key);
  } else {
    if (time) {
      var Days = time || 7; // 默认保留7小时
      var exp = new Date();
      window.localStorage[key] = JSON.stringify({
        value,
        expires: exp.getTime() + time * 60 * 60 * 1000
      });
    } else {
      window.localStorage[key] = JSON.stringify({value});
    }

  }
}

export function getCookie (key) {
  let o = window.localStorage[key];
  if (!o) {
    return null;
  }
  o = JSON.parse(o);
  if (o.expires < new Date().getTime()) {
    return null;
  } else {
    return o.value;
  }
}

export function removeCookie (key) {
  let o = JSON.parse(window.localStorage[key]);
  if (!o) {
    return false;
  } else {
    window.localStorage.removeItem(key);
  }
}
