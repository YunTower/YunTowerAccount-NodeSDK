class YunTowerAccountSDK {
  config: {
    api: string;
    origin_white_list: string[];
    appid: string;
    appsecret: string;
  };

  /** access_token 最大有效期 12 天（秒） */
  private static readonly ACCESS_TOKEN_MAX_EXPIRE = 12 * 24 * 3600;
  /** refresh_token 最大有效期 24 天（秒） */
  private static readonly REFRESH_TOKEN_MAX_EXPIRE = 24 * 24 * 3600;
  /** 头像文件最大 15MB */
  private static readonly AVATAR_MAX_SIZE = 15 * 1024 * 1024;

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
   * @param code 授权码
   * @param options 可选：accessTokenExpiresIn、refreshTokenExpiresIn（单位秒，最大分别为 12 天、24 天）
   */
  async getUserToken(
    code: string,
    options?: {
      accessTokenExpiresIn?: number;
      refreshTokenExpiresIn?: number;
    },
  ): Promise<any> {
    if (
      options?.accessTokenExpiresIn != null &&
      options.accessTokenExpiresIn > YunTowerAccountSDK.ACCESS_TOKEN_MAX_EXPIRE
    ) {
      throw new Error(
        `access_token 有效期不能超过 ${YunTowerAccountSDK.ACCESS_TOKEN_MAX_EXPIRE} 秒（12 天）`,
      );
    }
    if (
      options?.refreshTokenExpiresIn != null &&
      options.refreshTokenExpiresIn >
        YunTowerAccountSDK.REFRESH_TOKEN_MAX_EXPIRE
    ) {
      throw new Error(
        `refresh_token 有效期不能超过 ${YunTowerAccountSDK.REFRESH_TOKEN_MAX_EXPIRE} 秒（24 天）`,
      );
    }
    const data: Record<string, string | number> = {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      code,
    };
    if (
      options?.accessTokenExpiresIn != null &&
      options.accessTokenExpiresIn > 0
    ) {
      data.access_token_expires_in = options.accessTokenExpiresIn;
    }
    if (
      options?.refreshTokenExpiresIn != null &&
      options.refreshTokenExpiresIn > 0
    ) {
      data.refresh_token_expires_in = options.refreshTokenExpiresIn;
    }
    const res = await this.fetch(
      `${this.config.api}/user/token/get`,
      "POST",
      data,
    );
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

  /**
   * 设置用户昵称（1-64 字符）
   */
  async setUserNickname(access_token: string, nickname: string): Promise<any> {
    const len = [...nickname].length;
    if (len < 1 || len > 64) {
      throw new Error(`昵称长度须为 1-64 个字符，当前为 ${len} 个字符`);
    }
    const res = await this.fetch(`${this.config.api}/user/nickname`, "POST", {
      appid: this.config.appid,
      appsecret: this.config.appsecret,
      access_token,
      nickname,
    });
    return res;
  }

  /**
   * 设置用户头像
   * @param access_token 用户访问凭证
   * @param image 图片：Buffer、Blob 或本地文件路径（Node 下会读文件），≤15MB
   */
  async setUserAvatar(
    access_token: string,
    image: Buffer | Blob | string,
  ): Promise<any> {
    let blob: Blob;
    let filename = "avatar.jpg";
    if (typeof image === "string") {
      const fs = await import("fs/promises");
      const path = await import("path");
      const buf = await fs.readFile(image);
      if (buf.length > YunTowerAccountSDK.AVATAR_MAX_SIZE) {
        throw new Error(
          `头像文件不能超过 15MB，当前为 ${(buf.length / 1024 / 1024).toFixed(2)}MB`,
        );
      }
      blob = new Blob([new Uint8Array(buf)]);
      filename = path.basename(image) || filename;
    } else if (Buffer.isBuffer(image)) {
      if (image.length > YunTowerAccountSDK.AVATAR_MAX_SIZE) {
        throw new Error(
          `头像文件不能超过 15MB，当前为 ${(image.length / 1024 / 1024).toFixed(2)}MB`,
        );
      }
      blob = new Blob([new Uint8Array(image)]);
    } else {
      if (image.size > YunTowerAccountSDK.AVATAR_MAX_SIZE) {
        throw new Error(
          `头像文件不能超过 15MB，当前为 ${(image.size / 1024 / 1024).toFixed(2)}MB`,
        );
      }
      blob = image;
    }
    const form = new FormData();
    form.append("appid", this.config.appid);
    form.append("appsecret", this.config.appsecret);
    form.append("access_token", access_token);
    form.append("file", blob, filename);
    const url = `${this.config.api}/user/avatar`;
    const response = await fetch(url, {
      method: "POST",
      body: form,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseBody = await response.json();
    console.log("[YunTowerAccountSDK]: ", responseBody);
    return responseBody;
  }
}

export default YunTowerAccountSDK;
