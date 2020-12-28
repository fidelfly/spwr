import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { Authkit, invalidateToken, refreshToken } from "../auth";
import { WsException } from "../errors";
import { ErrCode } from "../constants";

export type ErrorType = "error" | "info" | "warning";

export interface RespError {
    error_code: string;
    error_message: string;
    type: ErrorType;
    data: unknown;
}

const resolveData = (resp: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => {
    if (resp.status === 202 && resp.headers && resp.headers["location"]) {
        const queryUrl = resp.headers["location"];
        const cfg = resp.config as RequestConfig;
        const interval = cfg.checkStatusInterval || 1000;
        const timeout = cfg.checkStatusTimeout || 0;
        const time = cfg.time || Date.now();
        if (timeout && Date.now() - time > timeout) {
            throw new WsException(408, `Server(408)`, "Long request timeout");
        }
        return new Promise(function (resolve): void {
            setTimeout(function () {
                const config = {
                    checkStatusInterval: interval,
                    checkStatusTimeout: timeout,
                    time: time,
                };
                resolve(Ajax.get(queryUrl, config));
            }, interval);
        });
    } else {
        return resp;
    }
};

const resolveError = (error: AxiosError): unknown => {
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (Ajax.isError(data)) {
            return Promise.reject(new WsException(status, data.error_code, data.error_message, data.data));
        } else {
            return Promise.reject(new WsException(status, error.code || `Server(${status})`, "", data));
        }
    }
    return Promise.reject(error);
};

axios.interceptors.response.use(resolveData, resolveError);

axios.interceptors.request.use(
    function (config) {
        config = config || {};
        const headers = config.headers || {};
        if (!headers["Authorization"]) {
            const accessToken = Authkit.getAuthorizeToken();
            if (accessToken) {
                headers["Authorization"] = accessToken;
                config.headers = headers;
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

interface RequestConfig extends AxiosRequestConfig {
    withAuthInject?: boolean;
    checkStatusInterval?: number;
    checkStatusTimeout?: number;
    time?: number;
}

export async function request<R = AxiosResponse>(config: RequestConfig): Promise<R> {
    if (config === undefined || config.withAuthInject !== false) {
        await Authkit.checkAuthorizeBeforeRequest();
    }
    try {
        return axios.request(config);
    } catch (e) {
        if ((e as WsException).code !== undefined) {
            const we = e as WsException;
            if (we.code === ErrCode.TokenExpired) {
                await refreshToken();
                return axios.request(config);
            } else if (we.code === ErrCode.Unauthorized) {
                invalidateToken();
            }
        }
        throw e;
    }
}

declare interface AjaxApi {
    get<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    delete<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    head<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    option<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    post<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;
    put<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;
    patch<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;

    isError(data: unknown): boolean;
}

/*const ajax = {};
["delete", "get", "head", "options"].forEach(function(method: string) {
    ajax[method] = function(url: string, config?: RequestConfig) {
        config = config || {};
        return request({
            ...config,
            method: method as Method,
            url: url,
        });
    };
});

["post", "put", "patch"].forEach(function(method: string) {
    /!*eslint func-names:0*!/
    ajax[method] = function(url: string, data?: any, config?: RequestConfig) {
        config = config || {};
        return request({
            ...config,
            method: method as Method,
            url: url,
            data: data,
        });
    };
});*/

function createRequestFunction<T = unknown, R = AxiosResponse<T>>(
    method: string
): (url: string, config?: RequestConfig) => Promise<R> {
    return function (url: string, config?: RequestConfig): Promise<R> {
        config = config || {};
        return request({
            ...config,
            method: method as Method,
            url: url,
        });
    };
}

function createDataRequestFunction<T = unknown, R = AxiosResponse<T>>(
    method: string
): (url: string, data?: T, config?: RequestConfig) => Promise<R> {
    return function (url: string, data?: T, config?: RequestConfig): Promise<R> {
        config = config || {};
        return request({
            ...config,
            method: method as Method,
            url: url,
            data: data,
        });
    };
}

export const Ajax: AjaxApi = {
    delete: createRequestFunction("delete"),
    get: createRequestFunction("get"),
    head: createRequestFunction("head"),
    option: createRequestFunction("option"),
    post: createDataRequestFunction("post"),
    put: createDataRequestFunction("put"),
    patch: createDataRequestFunction("patch"),

    isError(data: unknown): boolean {
        if (data === undefined || data === null) {
            return false;
        }
        return (data as RespError).error_code !== undefined;
    },
};

/*export const upload = ({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) => {
    const formData = new FormData();
    if (data) {
        Object.keys(data).map((key) => {
            formData.append(key, data[key]);
            return key;
        });
    }
    formData.append(filename, file);
    const config = {
        withCredentials,
        headers,
        onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
        },
    };
    authRequest("POST", action, formData, config)
        .then((response) => {
            onSuccess(response, file);
        })
        .catch(onError);

    return {
        abort() {
            console.log("upload progress is aborted."); /!*eslint-disable-line no-console*!/
        },
    };
};*/
/* eslint-enable @typescript-eslint/no-explicit-any*/
