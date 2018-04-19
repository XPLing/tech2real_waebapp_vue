import { commonVariable } from 'api/config';
import { setCookie, getCookie, removeCookie } from 'assets/js/cookie';

export const routerPrefix = '';

export let browser = {
  versions: (function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {
      // 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

export function getbrowserType () {
  if (browser.versions.mobile) {
    var ua = navigator.userAgent.toLowerCase();// 获取判断用的对象
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      if (browser.versions.android) {
        return 1.1;
      } else if (browser.versions.ios) {
        return 1.2;
      }
      return 1;
    }
    if (browser.versions.ios) {
      return 2;
    }
    if (browser.versions.android) {
      //  是否在安卓浏览器打开
      return 3;
    }
  } else {
    //  是否在桌面浏览器打开
    if (browser.versions.trident) {
      return 4;
    }
    return 0;
  }
}

export function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export function getUrlParameter (sParam, sPageURL, split) {
  var sURLVariables = sPageURL.split(split);
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
  return '';
}

export let cookieOperate = {
  setUserGuid: function(val){
    setCookie('userGuid', val);
  },
  getUserGuid: function(){
    return getCookie('userGuid');
  },
  removeUserGuid: function(){
    return removeCookie('userGuid');
  },
  setWechatOpenID: function(val){
    setCookie('WechatOpenID', val);
  },
  setBeforeLoginPage: function (val) {
    setCookie('beforeLoginPage', val);
  },
  getBeforeLoginPage: function() {
    return getCookie('beforeLoginPage');
  },
  removeBeforeLoginPage: function (){
    return removeCookie('beforeLoginPage');
  }
}

export let common = {
  hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
  },
  addClass (el, className) {
    if (hasClass(el, className)) {
      return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
  },
  getData (el, name, val) {
    const prefix = 'data-';
    const attributeName = prefix + name;
    if (val) {
      return el.setAttribute(attributeName, val);
    }
    return el.getAttribute(attributeName);
  },
  getbrowserType () {
    if (browser.versions.mobile) {
      var ua = navigator.userAgent.toLowerCase();// 获取判断用的对象
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        if (browser.versions.android) {
          return 1.1;
        } else if (browser.versions.ios) {
          return 1.2;
        }
        return 1;
      }
      if (browser.versions.ios) {
        return 2;
      }
      if (browser.versions.android) {
        //  是否在安卓浏览器打开
        return 3;
      }
    } else {
      //  是否在桌面浏览器打开
      if (browser.versions.trident) {
        return 4;
      }
      return 0;
    }
  },
  uuid (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  getUrlParameter (sParam, sPageURL, split) {
    var sURLVariables = sPageURL.split(split);
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
    return '';
  },
  formErrorMsg ({errorObj, name, message, rule, scope, interval}) {
    errorObj.clear(scope);
    errorObj.add(name, message, rule, scope);
    setTimeout(() => {
      errorObj.clear(scope);
    }, interval);
  },
  request: {
    tipMsg($this, data){
      $this.toptipTxt = data.message;
      $this.$refs.toptip.show();
    }
  }
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function addClass (el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function getData (el, name, val) {
  const prefix = 'data-';
  const attributeName = prefix + name;
  if (val) {
    return el.setAttribute(attributeName, val);
  }
  return el.getAttribute(attributeName);
}

export var globalVariable = {
  originWidth: 37.5
};

export function formErrorMsg ({errorObj, name, message, rule, scope, interval}) {
  errorObj.clear(scope);
  errorObj.add(name, message, rule, scope);
  setTimeout(() => {
    errorObj.clear(scope);
  }, interval);
}


