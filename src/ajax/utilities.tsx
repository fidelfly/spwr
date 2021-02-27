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

// const pathVarRegex = /\{(\w+)\}/gi;

const resolvePathVar = (path: string, params?: Record<string, unknown> | unknown[] | null): Record<string, string> => {
    const vars: Record<string, string> = {};
    const reg = /\{(\w+)\}/gi;
    let match = reg.exec(path);
    let index = 0;
    while (match != null) {
        const param = match[1] as string;
        vars[param] = "";
        if (params != null) {
            const len = (params as unknown[]).length;
            if (len != null) {
                if (len > index) {
                    vars[param] = `${(params as unknown[])[index]}`;
                }
            } else if ((params as Record<string, unknown>)[param] != null) {
                vars[param] = `${(params as Record<string, unknown>)[param]}`;
            }
        }
        index++;
        match = reg.exec(path);
    }
    return vars;
};

export const AjaxKit = {
    getURL: (path: string, params: Record<string, unknown>): string => {
        if (params != null) {
            return `${path}${qs.stringify(params, { addQueryPrefix: true })}`;
        }
        return path;
    },

    getPath: (basePath: string, params: Record<string, unknown> | unknown[] | null): string => {
        basePath = basePath.trim();
        if (!basePath.startsWith("/")) {
            basePath = "/" + basePath;
        }

        const vars = resolvePathVar(basePath, params);
        for (const key in vars) {
            basePath = basePath.replaceAll(new RegExp(`\\{${key}\\}`, "gi"), vars[key]);
        }

        basePath = basePath.replaceAll(/\/{2,}/gi, "/");

        basePath = basePath.replace(/\/$/, "");

        return basePath;
    },

    joinPath: (basePath: string, ...params: unknown[]): string => {
        basePath = basePath.trim();
        if (!basePath.startsWith("/")) {
            basePath = "/" + basePath;
        }

        if (params != null) {
            for (let i = 0; i < params.length; i++) {
                basePath += `/${params[i]}`;
            }
        }

        return basePath;
    },
};
