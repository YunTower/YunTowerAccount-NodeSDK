"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var YunTowerAccountSDK = /** @class */ (function () {
    function YunTowerAccountSDK(_a) {
        var appid = _a.appid, appsecret = _a.appsecret, _b = _a.state, state = _b === void 0 ? null : _b, _c = _a.scope, scope = _c === void 0 ? 'user_profile' : _c;
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
            appid: appid,
            appsecret: appsecret,
            scope: scope,
            state: state,
        };
    }
    // 判断是否是电脑
    YunTowerAccountSDK.prototype.isPC = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        return /windows|macintosh|linux/.test(userAgent);
    };
    /**
     * fetch
     * @param {string} url - 请求URL
     * @param {string} method - 请求方法 (GET | POST)
     * @param {Object} [data] - POST请求时的数据
     * @param {Object} [headers] - 自定义请求头
     * @returns {Promise<any>} - 解析后的响应体
     */
    YunTowerAccountSDK.prototype.fetch = function (url_1, method_1) {
        return __awaiter(this, arguments, void 0, function (url, method, data, headers) {
            var defaultHeaders, options, response, responseBody, error_1;
            if (data === void 0) { data = {}; }
            if (headers === void 0) { headers = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        defaultHeaders = __assign({ 'Content-Type': 'application/json' }, headers);
                        options = {
                            method: method,
                            headers: defaultHeaders,
                        };
                        // 如果是POST请求，需要设置body
                        if (method.toUpperCase() === 'POST') {
                            options.body = JSON.stringify(data);
                        }
                        return [4 /*yield*/, fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        // 检查响应状态
                        if (!response.ok) {
                            throw new Error("HTTP error! Status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseBody = _a.sent();
                        console.log('[YunTowerAccountSDK]: ', responseBody);
                        return [2 /*return*/, responseBody];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Fetch error:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 获取用户访问凭证
     * @param {string} token 临时Token
     * @param {string} tuid 临时UID
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    YunTowerAccountSDK.prototype.getUserToken = function (token_1, tuid_1) {
        return __awaiter(this, arguments, void 0, function (token, tuid, appid, appsecret) {
            var res;
            if (appid === void 0) { appid = this.config.appid; }
            if (appsecret === void 0) { appsecret = this.config.appsecret; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch("".concat(this.config.api, "/user/token/get"), "POST", {
                            token: token,
                            tuid: tuid,
                            appid: appid,
                            appsecret: appsecret
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 获取用户数据
     * @param {string} access_token 用户访问凭证
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    YunTowerAccountSDK.prototype.getUserInfo = function (access_token_1) {
        return __awaiter(this, arguments, void 0, function (access_token, appid, appsecret) {
            var res;
            if (appid === void 0) { appid = this.config.appid; }
            if (appsecret === void 0) { appsecret = this.config.appsecret; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch("".concat(this.config.api, "/user/data"), "POST", {
                            appid: appid,
                            appsecret: appsecret
                        }, {
                            Authorization: "Bearer ".concat(access_token)
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 刷新用户访问凭证
     * @param {string} refresh_token 用户刷新凭证
     * @param {string} appid 应用ID
     * @param {string} appsecret 应用密钥
     * @returns
     */
    YunTowerAccountSDK.prototype.refreshUserToken = function (refresh_token_1) {
        return __awaiter(this, arguments, void 0, function (refresh_token, appid, appsecret) {
            var res;
            if (appid === void 0) { appid = this.config.appid; }
            if (appsecret === void 0) { appsecret = this.config.appsecret; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch("".concat(this.config.api, "/user/token/refresh"), "POST", {
                            appid: appid,
                            appsecret: appsecret
                        }, {
                            Authorization: "Bearer ".concat(refresh_token)
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * 退出登录状态
     */
    YunTowerAccountSDK.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch("".concat(this.config.api, "/user/logout"), "POST")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return YunTowerAccountSDK;
}());
exports.default = YunTowerAccountSDK;
