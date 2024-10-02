class YunTowerAccountSDK {
  config: {
    auth: string,
    api: string,
    origin_white_list: string[],
    appid: string,
    appsecret: string,
    scope: string,
    state: any
  };

  constructor({
    appid,
    appsecret,
    state = null,
    scope = 'user_profile',
  }: {
    appid: string;
    appsecret: string;
    scope: string;
    state?: any;
  }) {
    if (!appid || !appsecret || !scope) {
      console.error('[YunTowerAccountSDK] 参数缺失');
    }

    if (!['user_profile'].includes(scope)) {
      console.error('[YunTowerAccountSDK] scope参数错误，目前只支持[user_profile]');
    }

    this.config = {
      auth: 'https://account.yuntower.cn',
      api: 'https://v1.api.account.yuntower.cn/open/v1',
      // auth:'http://localhost:3000',
      // api:'http://127.0.0.1:8787',
      origin_white_list: ['account.yuntower.cn', 'localhost:3000'],
      appid,
      appsecret,
      scope,
      state,
    };
  }
  /**
   * fetch
   * @param {string} url - 请求URL
   * @param {string} method - 请求方法 (GET | POST)
   * @param {Object} [data] - POST请求时的数据
   * @param {Object} [headers] - 自定义请求头
   * @returns {Promise<any>} - 解析后的响应体
   */
  async fetch(url: string, method: 'GET' | 'POST', data: object = {}, headers: object = {}): Promise<any> {
    try {
      // 设置默认请求头
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // 构建fetch选项
      const options: RequestInit = {
        method,
        headers: defaultHeaders,
      };

      // 如果是POST请求，需要设置body
      if (method.toUpperCase() === 'POST') {
        options.body = JSON.stringify(data);
      }

      // 发起请求
      const response = await fetch(url, options);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 解析响应体
      const responseBody = await response.json();
      console.log('[YunTowerAccountSDK]: ', responseBody)
      return responseBody;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  /**
   * 获取用户访问凭证
   * @param {string} token 临时Token
   * @param {string} tuid 临时UID
   * @param {string} appid 应用ID
   * @param {string} appsecret 应用密钥
   * @returns 
   */
  async getUserToken(token: string, tuid: string, appid: string = this.config.appid, appsecret: string = this.config.appsecret): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/token/get`, "POST", {
      token,
      tuid,
      appid,
      appsecret
    });

    return res;
  }

  /**
   * 获取用户数据
   * @param {string} access_token 用户访问凭证
   * @param {string} appid 应用ID
   * @param {string} appsecret 应用密钥
   * @returns 
   */
  async getUserInfo(access_token: string, appid: string = this.config.appid, appsecret: string = this.config.appsecret): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/data`, "POST", {
      appid,
      appsecret
    }, {
      Authorization: `Bearer ${access_token}`
    });

    return res;
  }

  /**
   * 刷新用户访问凭证
   * @param {string} refresh_token 用户刷新凭证
   * @param {string} appid 应用ID
   * @param {string} appsecret 应用密钥
   * @returns 
   */
  async refreshUserToken(refresh_token: string, appid: string = this.config.appid, appsecret: string = this.config.appsecret): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/token/refresh`, "POST", {
      appid,
      appsecret
    }, {
      Authorization: `Bearer ${refresh_token}`
    });

    return res;
  }

  /**
   * 退出登录状态
   * @param {string} access_token 用户访问凭证
   */
  async logout(access_token: string, appid: string = this.config.appid, appsecret: string = this.config.appsecret): Promise<{ code: number, msg: string, data: any }> {
    const res = await this.fetch(`${this.config.api}/user/logout`, "POST", {
      appid,
      appsecret
    }, {
      Authorization: `Bearer ${access_token}`
    });
    return res;
  }
}

export default YunTowerAccountSDK;