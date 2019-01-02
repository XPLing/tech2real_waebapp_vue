import { commonVariable } from 'api/config';
import {
  setCookie,
  getCookie,
  removeCookie,
  setCookieSession,
  getCookieSession,
  removeCookieSession
} from 'assets/js/cookie';

let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

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
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  type: getbrowserType
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
  setUserGuid: function (val) {
    setCookie('userGuid', val);
  },
  getUserGuid: function () {
    return getCookie('userGuid');
  },
  removeUserGuid: function () {
    return removeCookie('userGuid');
  },
  setUserInfo: function (val) {
    setCookie('UserInfo', val);
  },
  getUserInfo: function () {
    return getCookie('UserInfo');
  },
  removeUserInfo: function () {
    return removeCookie('UserInfo');
  },
  setWechatOpenID: function (val) {
    setCookie('WechatOpenID', val);
  },
  setBeforeLoginPage: function (val) {
    setCookieSession('beforeLoginPage', val);
  },
  getBeforeLoginPage: function () {
    return getCookieSession('beforeLoginPage');
  },
  removeBeforeLoginPage: function () {
    return removeCookieSession('beforeLoginPage');
  },
  setWeChatOpenGuid: function (val) {
    setCookie('WeChatOpen', val);
  },
  getWeChatOpenGuid: function () {
    return getCookie('WeChatOpen');
  },
  removeWeChatOpenGuid: function () {
    return removeCookie('WeChatOpen');
  }
};

export let common = {
  hasClass (el, className) {
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
  getWechatVersion () {
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\\.]+)/i);
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
    tipMsg ($this, data) {
      $this.toptipTxt = data.message;
      $this.$refs.toptip.show();
    }
  },
  calculateWH (num) {
    var windowW = parseInt(window.outerWidth || window.innerWidth || window.screen.width);
    windowW = windowW > 375 ? 375 / 10 : windowW / 10;
    return num / config.originWidth * windowW;
  },
  cssPrefix (style) {
    if (vendor === false) {
      return false;
    }
    if (vendor === 'standard') {
      return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
  },
  compile (code) {
    if (!code) {
      return code;
    }
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return decodeURIComponent(c);
  },
  uncompile (code) {
    if (!code) {
      return code;
    }
    code = encodeURIComponent(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  },
  deuce (arr, deuceNum) {
    var deuceItem = [], deuceArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var isBreakpoint = i % deuceNum === 0;
      if (isBreakpoint) {
        deuceItem = [];
        deuceItem.push(arr[i]);
        deuceArr.push(deuceItem);
      } else {
        deuceItem.push(arr[i]);
      }
    }
    return deuceArr;
  },
  openClient: function (scheme, yingYongBaoUrl) {
    // 打开应用或者跳转到应用宝产品网址
    var ua = navigator.userAgent.toLowerCase();
    var config = {
      scheme_IOS: scheme + '://',
      scheme_Adr: scheme + '://splash',
      download_url: yingYongBaoUrl,
      timeout: 2000
    };
    var startTime = Date.now();
    var ifr = document.createElement('iframe');
    var downUrl;
    ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
    downUrl = ua.indexOf('os') > 0 ? config.download_url : config.download_url;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
    var t = setTimeout(function () {
      var endTime = Date.now();
      if (!startTime || endTime - startTime < config.timeout + 200) {
        window.location = downUrl;
      } else {
      }
    }, config.timeout);
    window.onblur = function () {
      clearTimeout(t);
    }
  }
};

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

export let config = {
  originWidth: 37.5,
  payRedirectUri: process.env.NODE_ENV === 'development' ? 'https://open.dev.tech2real.com/m-web/payresult' : 'https://open.dev.tech2real.com/m-web/payresult'
};

export function formErrorMsg ({errorObj, name, message, rule, scope, interval}) {
  errorObj.clear(scope);
  errorObj.add(name, message, rule, scope);
  setTimeout(() => {
    errorObj.clear(scope);
  }, interval);
}


