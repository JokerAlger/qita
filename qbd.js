/**
 * 项目名：Q必达
 * 项目类型：APP
 * 变量名: qbd
 * 变量值: 账号#密码
 * 项目下载地址：http://register.wanhuida888.com/?inviter=83NPKAI
 * cron 10 7 * * *
 */

const $ = new Env("Q必达");
const ckName = "qbd";
const Notify = 1; //0为关闭通知,1为打开通知,默认为1
let envSplitor = ["@", "\n"]; //多用户分隔符

let msg = "";
let userList = [];
let userIdx = 0;
let timestamp = Date.now();
let userName = 0;
let point = 0;
let signin = false;
let isSigninDouble = false;
let token = "";


class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.phone = str.split("#")[0];
        this.pwd = str.split("#")[1];
         //单用户多变量分隔符
        this.ckStatus = true;
    }
    async main(){
        this.task_Login();
        await $.wait(3000);
        this.user_info();
        await $.wait(3000);
        if(signin == false){
            this.task_signIn();
        }
        await $.wait(3000);
        if(isSigninDouble == false){
            this.task_DoublePoint();
        }
        await $.wait(3000);
        for (let i = 1; i <= 3; i++) {
            $.DoubleLog(`用户[${userName}]  当前第 ${i}次看视频`);
            this.task_watchVideo();
            await $.wait(5000);
        }
        await $.wait(3000);
        $.DoubleLog(`用户[${userName}]  当前已有：${point} 积分`);
    }
    // 登录
    async task_Login(){
        try {
            const data = JSON.stringify({
                editionCode: 1835,
                deviceType: 1,
                password: `${this.pwd}`,
                genre: 0,
                edition: "1.9.5",
                deviceNo: "",
                account: `${this.phone}`
            });
            let options = {
                method: "POST",
                url: "http://y3zhmdginr.wuliucps.com/ht/web/login/loginNew?t="+timestamp,
                headers: {
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "User-Agent": "okhttp-okgo/jeasonlzy",
                    "source": "ANDROID",
                    "appId": "com.qsongq.fjqexpress",
                    "version": "1835",
                    "group": "",
                    "token": "",
                    "Content-Type": "application/json;charset=utf-8",
                    "Host": "y3zhmdginr.wuliucps.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip",
                    "cookies": "'group': ''"
                },
                body: data
            },
                result = await httpRequest(options);
            // console.log(options);
            // console.log(result);
            if (result.code == 0) {
                // $.DoubleLog(`账号[${this.index}]  登录成功，到期时间: ${result.data.expireDate}⏰`);
                token = result.data.token;
                this.ckStatus = true;
            } else {
                // $.DoubleLog(`账号[${this.index}]  登录失败,原因：${result.msg}❌`);
                this.ckStatus = false;
                //console.log(result);
            }

        } catch (e) {
            console.log(e);
        }
    }
    // 用户信息
    async user_info(){
        try {
            let options = {
                method: "GET",
                url: "http://wuliucps.com/ht/web/login/info?t="+timestamp,
                headers: {
                    'User-Agent': 'okhttp-okgo/jeasonlzy',
                    'Connection': 'Keep-Alive',
                    'Accept-Encoding': 'gzip',
                    'Accept-Language': 'zh-CN,zh;q=0.8',
                    'source': 'ANDROID',
                    'appId': 'com.qsongq.fjqexpress',
                    'version': '1835',
                    'group': '',
                    'token': `${token}`,
                    'Cookie': 'group='
                },
            },
                result = await httpRequest(options);
            //console.log(options);
            // console.log(result);
            if (result.code == 0) {
                // $.DoubleLog(`用户[${this.index}]  登录成功，已获取到用户信息`);
                let dataUpdate = null;
                dataUpdate = result.data;
                userName = dataUpdate.nickname;
                point = dataUpdate.integral;
                signin = dataUpdate.isSignIn;
                isSigninDouble = dataUpdate.isSignDouble;
                $.DoubleLog(`用户[${userName}]  注册手机号正在上传...`);
                await $.wait(3000);
                $.DoubleLog(`用户[${userName}]  注册手机号上传成功！`);
                $.DoubleLog(`用户[${userName}]  当前已有：${point} 积分`);
                this.ckStatus = true;
            } else {
                $.DoubleLog(`用户[${this.index}]  登录失败,原因：${result.msg}`);
                this.ckStatus = false;
                //console.log(result);
            }

        } catch (e) {
            console.log(e);
        }
    }
    // 签到
    async task_signIn() {
        try {
            const data = JSON.stringify({
                "group": ""
            });
            let options = {
                method: "POST",
                url: "http://wuliucps.com/ht/web/mine/signIn?t="+timestamp,
                headers: {
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "User-Agent": "okhttp-okgo/jeasonlzy",
                    "source": "ANDROID",
                    "appId": "com.qsongq.fjqexpress",
                    "version": "1835",
                    "group": "",
                    "token": `${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Host": "wuliucps.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip"
                },
                body: data
            },
                result = await httpRequest(options);
            //console.log(options);
            // console.log(result);
            if (result.code == 0) {
                $.DoubleLog(`用户[${userName}]  签到成功获得: ${result.data}积分🎉`);
                this.ckStatus = true;
            } else {
                $.DoubleLog(`用户[${userName}]  签到失败,原因：${result.msg}❌`);
                this.ckStatus = false;
                //console.log(result);
            }

        } catch (e) {
            console.log(e);
        }
    }
    // 双倍积分
    async task_DoublePoint() {
        try {
            const data = JSON.stringify({
                "data": "verify:true amount:10 name:积分 errorCode:0 errorMsg:"
            });
            let options = {
                method: "POST",
                url: "http://wuliucps.com/ht/web/mine/doublePoint?t="+timestamp,
                headers: {
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "User-Agent": "okhttp-okgo/jeasonlzy",
                    "source": "ANDROID",
                    "appId": "com.qsongq.fjqexpress",
                    "version": "1835",
                    "group": "",
                    "token": `${token}`,
                    "Content-Type": "application/json;charset=utf-8",
                    "Host": "wuliucps.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip"
                },
                body: data
            },
                result = await httpRequest(options);
            //console.log(options);
            // console.log(result);
            if (result.code == 0) {
                $.DoubleLog(`用户[${userName}]  看广告成功获得: ${result.data}积分🎉`);
                this.ckStatus = true;
            } else {
                $.DoubleLog(`用户[${userName}]  看广告失败,原因：${result.msg}❌`);
                this.ckStatus = false;
                //console.log(result);
            }
            
        } catch (e) {
            console.log(e);
        }
    }
    // 视频激励任务
    async task_watchVideo() {
        try {
            const data = JSON.stringify({
                "data": "verify:true amount:10 name:积分 errorCode:0 errorMsg:"
            });
            let options = {
                method: "POST",
                url: "http://wuliucps.com/ht/web/task/watchVideo?t="+timestamp,
                headers: {
                    "Accept-Language": "zh-CN,zh;q=0.8",
                    "User-Agent": "okhttp-okgo/jeasonlzy",
                    "source": "ANDROID",
                    "appId": "com.qsongq.fjqexpress",
                    "version": "1835",
                    "group": "",
                    "token": `${token}`,
                    "Content-Type": "application/json;charset=utf-8",
                    "Host": "wuliucps.com",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip"
                },
                body: data
            },
                result = await httpRequest(options);
            //console.log(options);
            // console.log(result);
            if (result.code == 0) {
                $.DoubleLog(`用户[${userName}]  看广告成功获得: ${result.data}积分🎉`);
                this.ckStatus = true;
            } else {
                $.DoubleLog(`用户[${userName}]  看广告失败,原因：${result.msg}❌`);
                this.ckStatus = false;
                //console.log(result);
            }
            
        } catch (e) {
            console.log(e);
        }
    }
}

async function start() {
    let taskall = [];
    for (let user of userList) {
        if (user.ckStatus) {
            taskall.push(await user.main());
            await $.wait(1000);
        }
    }
    await Promise.all(taskall);
}

!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
    await $.SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

//********************************************************
/**
 * 变量检查与处理
 * @returns
 */
async function checkEnv() {
    let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
    let userCount = 0;
    if (userCookie) {
        // console.log(userCookie);
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userCount}个用户`), true; //true == !0
}

/////////////////////////////////////////////////////////////////////////////////////
async function httpRequest(options, method) {
    method = options.method ? options.method.toLowerCase() : options.body ? "post" : "get";
  
    const requestOptions = {
      method: method.toUpperCase(),
      headers: options.headers,
      body: options.body
    };
  
    try {
      const response = await fetch(options.url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${method}请求失败`);
      console.error(error);
      throw error;
    }
  }
// 随机UA
function getUA() {
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const safari_version = `${randomInt(600, 700)}.${randomInt(1, 4)}.${randomInt(1, 5)}`;
    const ios_version = `${randomInt(12, 15)}.${randomInt(0, 6)}.${randomInt(0, 9)}`;
    const ua_string = `Mozilla/5.0 (iPhone; CPU iPhone OS ${ios_version} like Mac OS X) AppleWebKit/${safari_version} (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.20(0x16001422) NetType/WIFI Language/zh_CN`;

    return ua_string;
}
//Env
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return("POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})}))}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new(class{constructor(t,e){(this.name=t),(this.http=new s(this)),(this.data=null),(this.dataFile="box.dat"),(this.logs=[]),(this.isMute=!1),(this.isNeedRewrite=!1),(this.logSeparator="\n"),(this.encoding="utf-8"),(this.startTime=new Date().getTime()),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name},\u5f00\u59cb!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e)=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise((s)=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");(r=r?1*r:20),(r=e&&e.timeout?e.timeout:r);const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r,};this.post(n,(t,e,a)=>s(a))}).catch((t)=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{(this.fs=this.fs?this.fs:require("fs")),(this.path=this.path?this.path:require("path"));const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){(this.fs=this.fs?this.fs:require("fs")),(this.path=this.path?this.path:require("path"));const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(((r=Object(r)[t]),void 0===r))return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),(e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:(t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{}),t)[e[e.length-1]]=s),t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?("null"===i?null:i||"{}"):"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),(s=this.setval(JSON.stringify(e),a))}catch(e){const i={};this.lodash_set(i,r,t),(s=this.setval(JSON.stringify(i),a))}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return(this.data=this.loaddata()),this.data[t];default:return(this.data&&this.data[t])||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return((this.data=this.loaddata()),(this.data[e]=t),this.writedata(),!0);default:return(this.data&&this.data[e])||null}}initGotEnv(t){(this.got=this.got?this.got:require("got")),(tokentough=tokentough?tokentough:require("tough-cookie")),(tokenjar=tokenjar?tokenjar:new tokentough.CookieJar()),t&&((t.headers=t.headers?t.headers:{}),void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=tokenjar))}get(t,e=()=>{}){switch((t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),this.getEnv())){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&((t.headers=t.headers||{}),Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&((s.body=a),(s.statusCode=s.status?s.status:s.statusCode),(s.status=s.statusCode)),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&((t.opts=t.opts||{}),Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t)=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o,}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o,},i,o)},(t)=>e((t&&t.error)||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(tokentough.Cookie.parse).toString();s&&tokenjar.setCookieSync(s,null),(e.cookieJar=tokenjar)}}catch(t){this.logErr(t)}}).then((t)=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o,}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n,},n)},(t)=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=()=>{}){const s=t.method?t.method.toLocaleLowerCase():"post";switch((t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv())){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&((t.headers=t.headers||{}),Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&((s.body=a),(s.statusCode=s.status?s.status:s.statusCode),(s.status=s.statusCode)),e(t,s,a)});break;case"Quantumult X":(t.method=s),this.isNeedRewrite&&((t.opts=t.opts||{}),Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t)=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o,}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o,},i,o)},(t)=>e((t&&t.error)||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then((t)=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o,}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},(t)=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date();let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds(),};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),(e+=`${s}=${a}&`))}return(e=e.substring(0,e.length-1)),e}msg(e=t,s="",a="",r){const i=(t)=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a,}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============",];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),(this.logs=this.logs.concat(t))}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`\u2757\ufe0f${this.name},\u9519\u8bef!`,t);break;case"Node.js":this.log("",`\u2757\ufe0f${this.name},\u9519\u8bef!`,t.stack)}}wait(t){return new Promise((e)=>setTimeout(e,t))}DoubleLog(data){if($.isNode()){if(data){console.log(`${data}`);msg+=`\n ${data}`}}else{console.log(`${data}`);msg+=`\n ${data}`}}async SendMsg(message){if(!message)return;if(Notify>0){if($.isNode()){var notify=require("./sendNotify");await notify.sendNotify($.name,message)}else{$.msg($.name,"",message);console.log($.name,"",message)}}else{console.log(message)}}done(t={}){const e=new Date().getTime(),s=(e-this.startTime)/1e3;switch((this.log("",`\ud83d\udd14${this.name},\u7ed3\u675f!\ud83d\udd5b ${s}\u79d2`),this.log(),this.getEnv())){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}})(t,e)}