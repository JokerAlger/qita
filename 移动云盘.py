# 脚本名称: 中国移动云盘
# 功能描述: 组团领立减金
# 使用说明:
#   - 抓包 Cookie：任意Authorization
# 环境变量设置:
#   - 名称：ydypCk   值：Authorization值#手机号#authToken的值
#   - 多账号处理方式：换行或者@分割
# 定时设置: 0 0 0 * * *
# 更新日志:
# 注: 本脚本仅用于个人学习和交流，请勿用于非法用途。作者不承担由于滥用此脚本所引起的任何责任，请在下载后24小时内删除。
# 作者: 木兮
import os
import re
import time

import requests

cookies = os.getenv("ydypCk")
GLOBAL_DEBUG = False
ua = 'Mozilla/5.0 (Linux; Android 11; M2012K10C Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.210 Mobile Safari/537.36 MCloudApp/10.3.2'

need_help = ''  # 助力对象，手机号码，填这里就行
invite_num =4  # 邀请人数
inviteId = None  # 助力id
err_accounts = []


def send_request(url, headers=None, params=None, data=None, cookies=None, method='GET', debug=None):
    try:
        debug = debug if debug is not None else GLOBAL_DEBUG

        with requests.Session() as session:
            session.headers.update(headers or {})
            if cookies is not None:
                session.cookies.update(cookies)

            response = session.request(method, url, params = params, json = data)
            response.raise_for_status()

            if debug:
                print(response.text)

            return response

    except requests.RequestException as e:
        print("请求错误:", str(e))

    return None


def sso(cookie):
    Authorization = cookie.split("#")[0]
    account = cookie.split("#")[1]

    sso_url = 'https://orches.yun.139.com/orchestration/auth-rebuild/token/v1.0/querySpecToken'
    sso_headers = {
        'Authorization': Authorization,
        'User-Agent': ua,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': 'orches.yun.139.com'
    }
    sso_payload = {"account": account, "toSourceId": "001005"}
    sso_data = send_request(sso_url, headers = sso_headers, data = sso_payload, method = 'POST').json()

    if sso_data['success']:
        refresh_token = sso_data['data']['token']
        return refresh_token
    else:
        print(sso_data['message'])
        err_accounts.append(account)
        return None


def jwt(cookie):
    token = sso(cookie)
    if token is not None:
        jwt_url = f"https://caiyun.feixin.10086.cn:7071/portal/auth/tyrzLogin.action?ssoToken={token}"
        jwt_data = send_request(jwt_url, headers = {'User-Agent': ua}, method = 'POST').json()
        if jwt_data['code'] != 0:
            print(jwt_data['msg'])
            return None
        jwtToken = jwt_data['result']['token']
        return jwtToken
    else:
        print('-ck可能失效了')
        return None


# 检测邀请开启
def invite_check(cookie):
    jwtToken = jwt(cookie)
    jwtHeaders = {
        'User-Agent': ua,
        'Accept': '*/*',
        'Host': 'caiyun.feixin.10086.cn:7071',
        'jwtToken': jwtToken
    }
    check_url = 'https://caiyun.feixin.10086.cn/market/fissonactivity/invite/check'
    check_data = send_request(check_url, headers = jwtHeaders, method = "POST").json()
    status = check_data.get('result').get('status')
    global inviteId
    if status == 0:
        print('-开启组团领立减金活动')
        # 创建
        create_url = 'https://caiyun.feixin.10086.cn/market/fissonactivity/invite/create'
        create_data = send_request(create_url, headers = jwtHeaders, method = "POST").json()
        inviteId = create_data.get('reuslt')
        invite_info(jwtHeaders)
    else:
        print('-开始完成邀请任务')
        inviteId = check_data.get('result').get('inviteId')
        invite_info(jwtHeaders)


# 邀请信息
def invite_info(jwtHeaders):
    info_url = f'https://caiyun.feixin.10086.cn/market/fissonactivity/invite/{inviteId}'
    info_data = send_request(info_url, headers = jwtHeaders).json()
    currentInviteCount = info_data.get('result').get('currentInviteCount')  # 当前邀请人数
    completeInviteCount = info_data.get('result').get('completeInviteCount')  # 需要邀请人数
    global invite_num
    invite_num = completeInviteCount - currentInviteCount
    print(f'-当前还需邀请人数: {invite_num}')


# 开始邀请
def invite_help(cookie):
    jwtToken = jwt(cookie)
    if jwtToken is not None:
        jwtHeaders = {
            'User-Agent': ua,
            'Accept': '*/*',
            'Host': 'caiyun.feixin.10086.cn:7071',
            'jwtToken': jwtToken
        }
        help_url = f'https://caiyun.feixin.10086.cn/market/fissonactivity/invite/help/{inviteId}'
        help_data = send_request(help_url, headers = jwtHeaders, method = "POST").json()
        if help_data.get('msg') == 'success':
            prizeName = help_data.get("result", {}).get("fissonactivityPrizerecord", {}).get("prizeName", "")
            print(f'-助力成功,获得奖励: {prizeName}')
            return True
        else:
            print(f"-助力失败: {help_data.get('msg')}")
            return False
    else:
        return False


if __name__ == "__main__":
    env_name = 'ydypdh'
    token = os.getenv(env_name)
    if not token:
        print(f'⛔️未获取到ck变量：请检查变量 {env_name} 是否填写')
        exit(0)

    cookies = re.split(r'[@\n]', token)
    print(f"移动硬盘共获取到{len(cookies)}个账号")

    special_account_handled = False

    for cookie in cookies:
        account = cookie.split("#")[1]

        if account == need_help:
            print(f'-当前助力对象: 【{account}】')
            invite_check(cookie)
            time.sleep(3)
            special_account_handled = True
            break

    if not special_account_handled:
        print('-未找到需要助力对象，请填写正确 [need_help]')
        exit()

    for cookie in cookies:
        account = cookie.split("#")[1]

        if invite_num <= 0:
            break  # 已处理指定数量账号，跳出循环

        if account != need_help:  # 不是特殊账号时处理
            if invite_help(cookie):
                invite_num -= 1
                time.sleep(5)
            else:
                continue

    # 输出异常账号信息
    if err_accounts:
        print("\n异常账号:")
        for account in err_accounts:
            print(account)
    else:
        print('当前所有账号正常')
