class YunTowerAccountSDK {
  config: {
    api: string;
    origin_white_list: string[];
    appid: string;
    appsecret: string;
  };

  constructor(appid: string, appsecret: string) {
    if (!appid || !appsecret) {
      console.error("[YunTowerAccountSDK] 参数缺失");
    }

    this.config = {
      api: "https://v1.api.account.yuntower.com",
      origin_white_list: ["account.yuntower.cn", "account.yuntower.com"],
      appid,
      appsecret,
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
  async fetch(
    url: string,
    method: "GET" | "POST",
    data: object = {},
    headers: object = {},
  ): Promise<any> {
    try {
      // 设置默认请求头
      const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers,
      };

      // 构建fetch选项
      const options: RequestInit = {
        method,
        headers: defaultHeaders,
      };

      // 如果是POST请求，需要设置body
      if (method.toUpperCase() === "POST") {
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
      console.log("[YunTowerAccountSDK]: ", responseBody);
      return responseBody;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  /**
   * 获取用户访问凭证
   * @param {string} code 授权码
   * @returns
   */
  async getUserToken(code: string): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/token/get`, "POST", {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      code,
    });

    return res;
  }

  /**
   * 获取用户数据
   * @param {string} access_token 用户访问凭证
   * @returns
   */
  async getUserInfo(access_token: string): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/data`, "POST", {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      access_token,
    });

    return res;
  }

  /**
   * 刷新用户访问凭证
   * @param {string} refresh_token 用户刷新凭证
   * @returns
   */
  async refreshUserToken(refresh_token: string): Promise<any> {
    const res = await this.fetch(
      `${this.config.api}/user/token/refresh`,
      "POST",
      {
        appid: this.config.appid,
        appsecret: this.config.appsecret,
        refresh_token,
      },
    );

    return res;
  }

  /**
   * 退出登录状态
   * @param {string} access_token 用户访问凭证
   */
  async logout(access_token: string): Promise<{
    code: number;
    msg: string;
    data: any;
  }> {
    const res = await this.fetch(`${this.config.api}/user/logout`, "POST", {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      access_token,
    });
    return res;
  }

  /**
   * 获取用户关联账号UID
   * @param {string} access_token 用户访问凭证
   * @returns
   */
  async getThirdPartyAccount(access_token: string): Promise<any> {
    const res = await this.fetch(`${this.config.api}/user/connect`, "POST", {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      access_token,
    });

    return res;
  }
}

export default YunTowerAccountSDK;
