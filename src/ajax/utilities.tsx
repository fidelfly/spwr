import { AxiosRequestConfig } from "axios";
import qs from "qs";

const formRequestConfig: AxiosRequestConfig = {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformRequest: (data: any): any => {
        // headers["content-type"] = "application/x-www-form-urlencoded";
        return qs.stringify(data);
    },
};

declare interface AxiosUtilities {
    FormRequestConfig: AxiosRequestConfig;
}

export const AjaxCfg: AxiosUtilities = {
    FormRequestConfig: formRequestConfig,
};

export const AjaxKit = {
    getURL: (path: string, params: Record<string, unknown>): string => {
        if (params) {
            return `${path}${qs.stringify(params, { addQueryPrefix: true })}`;
        }
        return path;
    },

    getPath: (basePath: string, ...params: unknown[]): string => {
        for (let i = 0; i < params.length; i++) {
            basePath += `/${params[i]}`;
        }
        return basePath;
    },
};
