export var verifyMsg = {
  "phone": {
    "pattern": "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\\d{8}$",
    "verifyMsg": "必须是11位手机号码",
    "requireMsg": "手机号不能为空!"
  },
  "pw": {
    "pattern": "^\\w{6,16}$",
    "verifyMsg": "密码格式不正确!",
    "requireMsg": "密码不能为空!"
  },
  "verifycode": {
    "pattern": "^\\w{6}$",
    "verifyMsg": "验证码格式不正确!",
    "requireMsg": "验证码不能为空!"
  },
  "nickname": {
    "pattern": ".+",
    "verifyMsg": "昵称格式不正确!",
    "requireMsg": "昵称不能为空!"
  }
}
