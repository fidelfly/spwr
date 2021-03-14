import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { WsException } from "../errors";

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

const dateParser = function (key: unknown, value: unknown) {
    if (typeof value === "string") {
        let a = reISO.exec(value);
        if (a) {
            return new Date(value);
        }
        a = reMsAjax.exec(value);
        if (a) {
            const b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
};

export type MessageType = "error" | "info" | "warning" | "debug" | "fatal" | "success";

export interface AjaxMessage {
    code: string;
    message: string;
    type: MessageType;
    data?: Record<string, string | number | boolean | null | undefined | Date>;
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
        const resp = error.response;

        if (!Ajax.isMessage(resp.data)) {
            console.log(error);
        }

        return Promise.reject(error.response);
    } else {
        console.log(error);
    }
};

const AjaxInstance = axios.create({
    transformResponse: function (data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data, dateParser);
            } catch (e) {
                /* Ignore */
            }
        }
        return data;
    },
});

AjaxInstance.interceptors.response.use(resolveData, resolveError);

AjaxInstance.interceptors.request.use(function (config) {
    return config;
});

interface RequestConfig extends AxiosRequestConfig {
    checkStatusInterval?: number;
    checkStatusTimeout?: number;
    time?: number;
}

export const ApiBase = process.env.API_BASE || "/api";

export function joinBase(url: string): string {
    url = url.trim();
    if (!url.startsWith("/")) {
        url = "/" + url;
    }
    if (!url.startsWith(ApiBase)) {
        url = ApiBase + url;
    }

    return url;
}

export async function request<T = unknown, R = AxiosResponse<T>>(config: RequestConfig): Promise<R> {
    if (config.url != null) {
        config.url = joinBase(config.url);
    }
    return AjaxInstance.request<T, R>(config);
}

declare interface AjaxApi {
    request<T = unknown, R = AxiosResponse<T>>(config: RequestConfig): Promise<R>;
    get<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    delete<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    head<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    option<T = unknown, R = AxiosResponse<T>>(url: string, config?: RequestConfig): Promise<R>;
    post<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;
    put<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;
    patch<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: RequestConfig): Promise<R>;

    isMessage(data: unknown): boolean;
    isError(data: unknown): boolean;
}

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
    request: request,
    delete: createRequestFunction("delete"),
    get: createRequestFunction("get"),
    head: createRequestFunction("head"),
    option: createRequestFunction("option"),
    post: createDataRequestFunction("post"),
    put: createDataRequestFunction("put"),
    patch: createDataRequestFunction("patch"),

    isError(data: unknown): boolean {
        if (this.isMessage(data)) {
            return (data as AjaxMessage).type === "error";
        }

        return false;
    },

    isMessage(data: unknown): boolean {
        if (data == null) {
            return false;
        }
        const msg = data as AjaxMessage;

        return msg.code != null && msg.type != null;
    },
};

export default AjaxInstance;
