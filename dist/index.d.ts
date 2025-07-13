declare class YunTowerAccountSDK {
    config: {
        auth: string;
        api: string;
        origin_white_list: string[];
        appid: string;
        appsecret: string;
        scope: string;
        state: any;
    };
    constructor({ appid, appsecret, state, scope, }: {
        appid: string;
        appsecret: string;
        scope: string;
        state?: any;
    });
    /**
     * fetch
     * @param {string} url - 请求URL
     * @param {string} method - 请求方法 (GET | POST)
     * @param {Object} [data] - POST请求时的数据
     * @param {Object} [headers] - 自定义请求头
     * @returns {Promise<any>} - 解析后的响应体
     */
    fetch(url: string, method: 'GET' | 'POST', data?: object, headers?: object): Promise<any>;
    /**
     * 获取用户访问凭证
     * @param {string} token 临时Token
     * @param {string} tuid 临时UID
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    getUserToken(token: string, tuid: string, appid?: string, appsecret?: string): Promise<any>;
    /**
     * 获取用户数据
     * @param {string} access_token 用户访问凭证
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    getUserInfo(access_token: string, appid?: string, appsecret?: string): Promise<any>;
    /**
     * 刷新用户访问凭证
     * @param {string} refresh_token 用户刷新凭证
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    refreshUserToken(refresh_token: string, appid?: string, appsecret?: string): Promise<any>;
    /**
     * 退出登录状态
     * @param {string} access_token 用户访问凭证
     */
    logout(access_token: string, appid?: string, appsecret?: string): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    /**
     * 获取用户第三方账号信息
     * @param {string} access_token 用户访问凭证
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    getThirdPartyAccount(access_token: string, appid?: string, appsecret?: string): Promise<any>;
}
export default YunTowerAccountSDK;
