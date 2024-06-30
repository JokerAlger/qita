
let _0x1cbe1e = 3, userCount = 1, _0x148eb1 = 50000, _0x191c8c = 1, index = 2, name = "1314", _0x3d9810 = "10000002", _0xa01453 = "7k1HcDL8RKvc",
  _0x368aa5 = require("crypto-js"), _0x2bba68 = require("got"), _0x49426e = "woreadst^&*12345", _0x18c84f = "16-Bytes--String", _0x469423 = "iphone_c@11.0503",
  _0x4872bf = "10000006", _0x457ac0 = "yQsp9gUqv7qX", _0x3bb78f = "9",
  _0x20c0ff = "QzUzOUM2QTQ2MTc4",
  _0x281cdf = "",
  default_wait_interval = 1000,
  default_wait_limit = 3600000,
  default_wait_ahead = 0;
let woread_token = '',
  woread_userid = '',
  woread_userIndex = '',
  mobile = phone,
  woread_verifycode = '',
  token_online = ''

let _0x4bb73f = {
  "limit": 0
},
  _0x274170 = {
    "Connection": "keep-alive"
  },
  _0x4f8396 = {
    "retry": _0x4bb73f,
    "timeout": 50000,
    "followRedirect": false,
    "ignoreInvalidCookies": true,
    "headers": _0x274170
  };
got = _0x2bba68.extend(_0x4f8396);
async function moonbox_receiveActiveTask(_0x51510f, _0x1466a8 = {}) {
  try {
    let _0x46dd68 = _0x51510f,
      _0x213cc8 = _0x46dd68?.["taskDetail"]?.["taskName"] || "",
      _0x2744f9 = {
        "activeId": 16,
        "taskId": 105,
        ...get_woread_param()
      },
      _0x6ce9dd = encode_woread(_0x2744f9);
    const _0x225719 = {
      "sign": _0x6ce9dd
    },
      _0xe8ad = {
        "fn": "moonbox_queryActiveTaskList",
        "method": "post",
        "url": "https://10010.woread.com.cn/ng_woread_service/rest/activity423/receiveActiveTask",
        "json": _0x225719
      };
    let {
      result: _0x288055
    } = await woread_api(_0xe8ad),
      _0x4c2ecf = get(_0x288055, "code", -1);
    if (_0x4c2ecf == "0000") moonbox_task_record[_0x213cc8] = true, log("领取阅光宝盒任务[" + _0x213cc8 + "]成功"); else {
      let _0x52da57 = _0x288055?.["message"] || "";
      log("领取阅光宝盒任务[" + _0x213cc8 + "]失败[" + _0x4c2ecf + "]: " + _0x52da57);
      (_0x52da57?.["includes"]("今天无法完成") || _0x52da57?.["includes"]("领光了")) && _0x51510f.length > 0 && (await wait(100), await moonbox_receiveActiveTask(_0x51510f, _0x1466a8));
    }
  } catch (_0x53f18f) {
    console.log(_0x53f18f);
  }
}
async function userLoginTask() {
  if (!(await onLine())) {
    return;
  }
  if (!(await woread_auth())) {
    return;
  }
  if (!(await woread_login())) {
    return;
  }
  if (!(await woread_m_auth())) {
    return;
  }
  if (!(await woread_m_login())) return;
  switch_woread_token(woread_accesstoken);
  await wait_until('23:59:59')
  for (let i = 0; i < 5; i++) {
    (await moonbox_receiveActiveTask());
  }
}
userLoginTask()
function get_woread_param() {
  return {
    "timestamp": time("yyyyMMddhhmmss"),
    "token": woread_token,
    "userid": woread_userid,
    "userId": woread_userid,
    "userIndex": woread_userIndex,
    "userAccount": mobile,
    "verifyCode": woread_verifycode
  };
}

async function woread_login(_0x21d051 = {}) {
  let _0x1ed2e0 = false;
  try {
    let _0xe25a3b = {
      "phone": mobile,
      "timestamp": time("yyyyMMddhhmmss")
    },
      _0x53d901 = encode_woread(_0xe25a3b);
    const _0x467213 = {
      "sign": _0x53d901
    },
      _0x4e5558 = {
        "fn": "woread_login",
        "method": "post",
        "url": "https://10010.woread.com.cn/ng_woread_service/rest/account/login",
        "json": _0x467213
      };
    let {
      result: _0x516d47
    } = await request(_0x4e5558),
      _0x398486 = get(_0x516d47, "code", -1);
    if (_0x398486 == "0000") {
      _0x1ed2e0 = true;
      let {
        userid: _0x1b1700,
        userindex: _0x561755,
        token: _0x4732fb,
        verifycode: _0x48fb38
      } = _0x516d47?.["data"];
      woread_token = _0x4732fb;
      woread_verifycode = _0x48fb38;
      const _0x271e7c = {
        "woread_userid": _0x1b1700,
        "woread_userindex": _0x561755,
        "woread_token": _0x4732fb,
        "woread_verifycode": _0x48fb38
      };
      Object.assign(this, _0x271e7c);
    } else {
      let _0x564033 = _0x516d47?.["message"] || "";
      log("阅读专区获取token失败[" + _0x398486 + "]: " + _0x564033);
    }
  } catch (_0x4b2d3c) {
    console.log(_0x4b2d3c);
  } finally {
    return _0x1ed2e0;
  }
}

function time(_0x3f2ee0, _0x5087a2 = null) {
  let _0x519ec2 = _0x5087a2 ? new Date(_0x5087a2) : new Date(),
    _0xa0c005 = {
      "M+": _0x519ec2.getMonth() + 1,
      "d+": _0x519ec2.getDate(),
      "h+": _0x519ec2.getHours(),
      "m+": _0x519ec2.getMinutes(),
      "s+": _0x519ec2.getSeconds(),
      "q+": Math.floor((_0x519ec2.getMonth() + 3) / 3),
      "S": padStr(_0x519ec2.getMilliseconds(), 3)
    };
  /(y+)/.test(_0x3f2ee0) && (_0x3f2ee0 = _0x3f2ee0.replace(RegExp.$1, (_0x519ec2.getFullYear() + "").substr(4 - RegExp.$1.length)));
  for (let _0x307a84 in _0xa0c005) new RegExp("(" + _0x307a84 + ")").test(_0x3f2ee0) && (_0x3f2ee0 = _0x3f2ee0.replace(RegExp.$1, 1 == RegExp.$1.length ? _0xa0c005[_0x307a84] : ("00" + _0xa0c005[_0x307a84]).substr(("" + _0xa0c005[_0x307a84]).length)));
  return _0x3f2ee0;
}
function get(_0x524211, _0x22fc1d, _0x2b6468 = "") {
  let _0xa9d2bf = _0x2b6468;
  return _0x524211?.["hasOwnProperty"](_0x22fc1d) && (_0xa9d2bf = _0x524211[_0x22fc1d]), _0xa9d2bf;
}

function padStr(_0x34ffe5, _0x18dafe, _0x22521e = {}) {
  let _0x2d7644 = _0x22521e.padding || "0",
    _0x551ef1 = _0x22521e.mode || "l",
    _0x254b15 = String(_0x34ffe5),
    _0x207fbe = _0x18dafe > _0x254b15.length ? _0x18dafe - _0x254b15.length : 0,
    _0x3b0485 = "";
  for (let _0xc955ce = 0; _0xc955ce < _0x207fbe; _0xc955ce++) {
    _0x3b0485 += _0x2d7644;
  }
  return _0x551ef1 == "r" ? _0x254b15 = _0x254b15 + _0x3b0485 : _0x254b15 = _0x3b0485 + _0x254b15, _0x254b15;
}
function encode_woread(_0x22dfe7, _0x4286b4 = _0x49426e) {
  let _0x565a7e = _0x71b805("AES", "CBC", "Pkcs7", JSON.stringify(_0x22dfe7), _0x4286b4, _0x18c84f);
  return Buffer.from(_0x565a7e, "utf-8").toString("base64");
}
function _0x71b805(_0x5dec55, _0x28cd7b, _0x4ddf2e, _0x1884d5, _0x4a53b2, _0x5300bc) {
  return _0x368aa5[_0x5dec55].encrypt(_0x368aa5.enc.Utf8.parse(_0x1884d5), _0x368aa5.enc.Utf8.parse(_0x4a53b2), {
    "mode": _0x368aa5.mode[_0x28cd7b],
    "padding": _0x368aa5.pad[_0x4ddf2e],
    "iv": _0x368aa5.enc.Utf8.parse(_0x5300bc)
  }).ciphertext.toString(_0x368aa5.enc.Hex);
}

async function woread_api(_0x2ca0d6) {
  let _0x4ea22a = await request(copy(_0x2ca0d6)),
    _0x1acff3 = _0x4ea22a?.["result"]?.["message"] || "";
  return _0x1acff3?.["includes"]("登录已过期") && (await woread_auth()) && (await woread_login()) && (_0x4ea22a = await request(copy(_0x2ca0d6))), _0x4ea22a;
}

function copy(_0x49f276) {
  return Object.assign({}, _0x49f276);
}

async function request(_0x230a1e) {
  const _0x2a0b45 = ["ECONNRESET", "EADDRINUSE", "ENOTFOUND", "EAI_AGAIN"],
    _0x2ac302 = ["TimeoutError"],
    _0x5a3fa0 = ["EPROTO"],
    _0x54f2f2 = [];
  var _0x2ae6f8 = null,
    _0x36fb7a = 0,
    _0x56023b = _0x230a1e.fn || _0x230a1e.url;
  let _0x204503 = get(_0x230a1e, "valid_code", _0x54f2f2);
  _0x230a1e.method = _0x230a1e?.["method"]?.["toUpperCase"]() || "GET";
  let _0x5d1cb9, _0x566311;
  while (_0x36fb7a < _0x1cbe1e) {
    try {
      _0x36fb7a++;
      _0x5d1cb9 = "";
      _0x566311 = "";
      let _0x8c8bd7 = null,
        _0x179c9c = _0x230a1e?.["timeout"] || got?.["defaults"]?.["options"]?.["timeout"]?.["request"] || _0x148eb1,
        _0x29c055 = false,
        _0x19e2f5 = Math.max(2 - 2, 0),
        _0x56f81f = Math.min(Math.max(2 - 2, 1), 4),
        _0x19f0c4 = Math.min(Math.max(2 - 4, 1), 5),
        _0x3c2d3e = _0x19e2f5 * _0x56f81f * _0x19f0c4 * _0x19f0c4 * 600,
        _0x15438e = _0x19e2f5 * _0x56f81f * _0x19f0c4 * _0x19f0c4 * 4000,
        _0x582db9 = _0x3c2d3e + Math.floor(Math.random() * _0x15438e),
        _0x4f309c = _0x191c8c * (_0x191c8c - 1) * 3000,
        _0x448528 = (_0x191c8c - 1) * (_0x191c8c - 1) * 5000,
        _0x5742b9 = _0x4f309c + Math.floor(Math.random() * _0x448528),
        _0x57a6c3 = Math.max(userCount - 2, 0),
        _0x2278ba = Math.max(userCount - 3, 0),
        _0x537ae0 = _0x57a6c3 * 400,
        _0x38b1c1 = _0x2278ba * 1000,
        _0x53a0b8 = _0x537ae0 + Math.floor(Math.random() * _0x38b1c1),
        _0x2cdaf5 = _0x582db9 + _0x5742b9 + _0x53a0b8;
      await wait(_0x2cdaf5);
      await new Promise(async _0x441c73 => {
        setTimeout(() => {
          _0x29c055 = true;
          _0x441c73();
        }, _0x179c9c);
        await got(_0x230a1e).then(_0x36089d => {
          _0x2ae6f8 = _0x36089d;
        }, _0x4fd098 => {
          _0x8c8bd7 = _0x4fd098;
          _0x2ae6f8 = _0x4fd098.response;
          _0x5d1cb9 = _0x8c8bd7?.["code"] || "";
          _0x566311 = _0x8c8bd7?.["name"] || "";
        });
        _0x441c73();
      });
      if (_0x29c055) log("[" + _0x56023b + "]请求超时(" + _0x179c9c / 1000 + "秒)，重试第" + _0x36fb7a + "次"); else {
        if (_0x5a3fa0.includes(_0x5d1cb9)) {
          log("[" + _0x56023b + "]请求错误[" + _0x5d1cb9 + "][" + _0x566311 + "]");
          if (_0x8c8bd7?.["message"]) {
            console.log(_0x8c8bd7.message);
          }
          break;
        } else {
          if (_0x2ac302.includes(_0x566311)) log("[" + _0x56023b + "]请求错误[" + _0x5d1cb9 + "][" + _0x566311 + "]，重试第" + _0x36fb7a + "次"); else {
            if (_0x2a0b45.includes(_0x5d1cb9)) log("[" + _0x56023b + "]请求错误[" + _0x5d1cb9 + "][" + _0x566311 + "]，重试第" + _0x36fb7a + "次"); else {
              let _0x13de91 = _0x2ae6f8?.["statusCode"] || "",
                _0x507594 = _0x13de91 / 100 | 0;
              if (_0x13de91) {
                _0x507594 > 3 && !_0x204503.includes(_0x13de91) && (_0x13de91 ? log("请求[" + _0x56023b + "]返回[" + _0x13de91 + "]") : log("请求[" + _0x56023b + "]错误[" + _0x5d1cb9 + "][" + _0x566311 + "]"));
                if (_0x507594 <= 4) break;
              } else {
                log("请求[" + _0x56023b + "]错误[" + _0x5d1cb9 + "][" + _0x566311 + "]");
              }
            }
          }
        }
      }
    } catch (_0x1c2021) {
      _0x1c2021.name == "TimeoutError" ? log("[" + _0x56023b + "]请求超时，重试第" + _0x36fb7a + "次") : log("[" + _0x56023b + "]请求错误(" + _0x1c2021.message + ")，重试第" + _0x36fb7a + "次");
    }
  }
  if (_0x2ae6f8 == null) return Promise.resolve({
    "statusCode": _0x5d1cb9 || -1,
    "headers": null,
    "result": null
  });
  let {
    statusCode: _0x5f592e,
    headers: _0x4b817a,
    body: _0x1593b4
  } = _0x2ae6f8;
  if (_0x1593b4) try {
    _0x1593b4 = JSON.parse(_0x1593b4);
  } catch { }
  const _0x11f5c5 = {
    "statusCode": _0x5f592e,
    "headers": _0x4b817a,
    "result": _0x1593b4
  };
  return Promise.resolve(_0x11f5c5);
}
function log(_0x3cf8f0, _0x315973 = {}) {
  var _0x4c41a8 = "",
    _0x35dba2 = 2;
  index && (_0x4c41a8 += "账号[" + padStr(index, _0x35dba2) + "]");
  name && (_0x4c41a8 += "[" + name + "]");

  // 输出日志内容
  console.log(_0x4c41a8 + _0x3cf8f0);

}
function wait(_0x74610e) {
  return new Promise(_0x3f7336 => setTimeout(_0x3f7336, _0x74610e));
}

async function woread_auth(_0x76d5ae = {}) {
  let _0x3a002a = false;
  try {
    let _0x52fe28 = time("yyyyMMddhhmmss");
    const _0x49e6fb = {
      "timestamp": _0x52fe28
    };
    let _0x205cf7 = encode_woread(_0x49e6fb),
      _0x255ef1 = Date.now().toString(),
      _0x31acfe = _0x368aa5.MD5(_0x3d9810 + _0xa01453 + _0x255ef1).toString();
    const _0x5e95a2 = {
      "sign": _0x205cf7
    },
      _0x364f84 = {
        "fn": "woread_auth",
        "method": "post",
        "url": "https://10010.woread.com.cn/ng_woread_service/rest/app/auth/" + _0x3d9810 + "/" + _0x255ef1 + "/" + _0x31acfe,
        "json": _0x5e95a2
      };
    let {
      result: _0x2341d6
    } = await request(_0x364f84),
      _0x3a753a = get(_0x2341d6, "code", -1);
    if (_0x3a753a == "0000") _0x3a002a = true, woread_accesstoken = _0x2341d6?.["data"]?.["accesstoken"], switch_woread_token(woread_accesstoken); else {
      let _0x5ce8f6 = _0x2341d6?.["message"] || "";
      log("阅读专区获取accesstoken失败[" + _0x3a753a + "]: " + _0x5ce8f6);
    }
  } catch (_0x1df330) {
    console.log(_0x1df330);
  } finally {
    return _0x3a002a;
  }
}

function switch_woread_token(_0x31d078) {
  const _0x176c7b = {
    "accesstoken": _0x31d078
  },
    _0x355869 = {
      "headers": _0x176c7b
    };
  got = got.extend(_0x355869);
}

async function onLine(_0x29db01 = {}) {
  let _0x61dfe6 = false;
  try {
    let _0x5bf29f = {
      "fn": "onLine",
      "method": "post",
      "url": "https://m.client.10010.com/mobileService/onLine.htm",
      "form": {
        "token_online": token_online,
        "reqtime": time("yyyy-MM-dd hh:mm:ss"),
        "appId": _0x281cdf,
        "version": _0x469423,
        "step": "bindlist",
        "isFirstInstall": 0,
        "deviceModel": "iPhone"
      }
    },
      {
        result: _0x2cc7e2,
        statusCode: _0x687875
      } = await request(_0x5bf29f),
      _0xe761d0 = get(_0x2cc7e2, "code", _0x687875);
    if (_0xe761d0 == 0) {
      _0x61dfe6 = true;
      valid = true;
      mobile = _0x2cc7e2?.["desmobile"];
      name = _0x2cc7e2?.["desmobile"];
      ecs_token = _0x2cc7e2?.["ecs_token"];
      city = _0x2cc7e2?.["list"];
      log("登录成功");
    } else valid = false, log("登录失败[" + _0xe761d0 + "]");
  } catch (_0x3a5c58) {
    console.log(_0x3a5c58);
  } finally {
    return _0x61dfe6;
  }
}
async function woread_m_auth(_0x4bb71d = {}) {
  let _0x3f964a = false;
  try {
    let _0x4d8c0b = Date.now().toString(),
      _0x79ae8e = _0x368aa5.MD5(_0x4872bf + _0x457ac0 + _0x4d8c0b).toString();
    const _0x4a21a6 = {
      "fn": "woread_auth",
      "method": "get",
      "url": "https:///m.woread.com.cn/api/union/app/auth/" + _0x4872bf + "/" + _0x4d8c0b + "/" + _0x79ae8e
    };
    let {
      result: _0x11b167
    } = await request(_0x4a21a6),
      _0x806a2a = get(_0x11b167, "code", -1);
    if (_0x806a2a == "0000") _0x3f964a = true, woread_m_accesstoken = _0x11b167?.["data"]?.["accesstoken"], switch_woread_token(woread_m_accesstoken); else {
      let _0x54f207 = _0x11b167?.["message"] || "";
      log("阅读专区获取accesstoken失败[" + _0x806a2a + "]: " + _0x54f207);
    }
  } catch (_0x29eeb4) {
    console.log(_0x29eeb4);
  } finally {
    return _0x3f964a;
  }
}
async function woread_m_login(_0x5e1a = {}) {
  let _0x3899f4 = false;
  try {
    let _0x31ca4d = {
      "userid": woread_userid,
      "token": woread_token,
      "timestamp": Date.now()
    },
      _0x484ce8 = {
        "userData": Buffer.from(JSON.stringify(_0x31ca4d), "utf-8").toString("base64"),
        ...get_woread_m_param()
      };
    delete _0x484ce8.token;
    let _0x4ad81d = encode_woread(_0x484ce8, _0x20c0ff);
    const _0x1a21cd = {
      "sign": _0x4ad81d
    },
      _0xa9ba73 = {
        "fn": "woread_login",
        "method": "post",
        "url": "https://m.woread.com.cn/api/union/user/thirdPartyFreeLogin",
        "json": _0x1a21cd
      };
    let {
      result: _0x3d44ea
    } = await request(_0xa9ba73),
      _0x18c9c9 = get(_0x3d44ea, "code", -1);
    if (_0x18c9c9 == "0000") _0x3899f4 = true; else {
      let _0x617d00 = _0x3d44ea?.["message"] || "";
      log("阅读专区获取token失败[" + _0x18c9c9 + "]: " + _0x617d00);
    }
  } catch (_0x10af92) {
    console.log(_0x10af92);
  } finally {
    return _0x3899f4;
  }
}
function get_woread_m_param() {
  return {
    "timestamp": time("yyyyMMddhhmmss"),
    "signtimestamp": Date.now(),
    "source": _0x3bb78f,
    "token": woread_token
  };
}

async function wait_until(_0x3e404d, _0x175236 = {}) {
  let _0x1dd36a = _0x175236.logger || this,
    _0x22246f = _0x175236.interval || default_wait_interval,
    _0x2d0cce = _0x175236.limit || default_wait_limit,
    _0x536cea = _0x175236.ahead || default_wait_ahead;
  if (typeof _0x3e404d == "string" && _0x3e404d.includes(":")) {
    if (_0x3e404d.includes("-")) {
      _0x3e404d = new Date(_0x3e404d).getTime();
    } else {
      let _0xe14cad = time("yyyy-MM-dd ");
      _0x3e404d = new Date(_0xe14cad + _0x3e404d).getTime();
    }
  }
  let _0x5707f8 = normalize_time(_0x3e404d) - _0x536cea,
    _0x32da67 = time("hh:mm:ss.S", _0x5707f8),
    _0x40a678 = Date.now();
  _0x40a678 > _0x5707f8 && (_0x5707f8 += 86400000);
  let _0x52227a = _0x5707f8 - _0x40a678;
  if (_0x52227a > _0x2d0cce) {
    const _0x3726cd = {
      "time": true
    };
    log("离目标时间[" + _0x32da67 + "]大于" + _0x2d0cce / 1000 + "秒,不等待", _0x3726cd);
  } else {
    const _0x23af91 = {
      "time": true
    };
    log("离目标时间[" + _0x32da67 + "]还有" + _0x52227a / 1000 + "秒,开始等待", _0x23af91);
    while (_0x52227a > 0) {
      let _0x329590 = Math.min(_0x52227a, _0x22246f);
      await wait(_0x329590);
      _0x40a678 = Date.now();
      _0x52227a = _0x5707f8 - _0x40a678;
    }
    const _0x18f2cd = {
      "time": true
    };
    log("已完成等待", _0x18f2cd);
  }
}
function normalize_time(_0x4ab19e, _0x1d898e = {}) {
  let _0x45cc8c = _0x1d898e.len || 13;
  _0x4ab19e = _0x4ab19e.toString();
  let _0x2a1f8d = _0x4ab19e.length;
  while (_0x2a1f8d < _0x45cc8c) {
    _0x4ab19e += "0";
  }
  return _0x2a1f8d > _0x45cc8c && (_0x4ab19e = _0x4ab19e.slice(0, 13)), parseInt(_0x4ab19e);
}