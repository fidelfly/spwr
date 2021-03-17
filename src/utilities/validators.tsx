import { RuleObject } from "rc-field-form/lib/interface";
import { WsPath } from "../constants";
import { Ajax, AjaxCfg, AjaxKit } from "../ajax";

export const unique = (
    typeOrPath: string,
    message: string,
    config?: RuleObject | null,
    errHandler?: (e: unknown) => void
): RuleObject => {
    return {
        ...config,
        validator: async (rule, value): Promise<unknown> => {
            if (value == null || (typeof value === "string" && value.length === 0)) {
                return true;
            }
            let ajaxPath = "";
            if (typeOrPath.indexOf("/") >= 0) {
                ajaxPath = typeOrPath;
            } else {
                ajaxPath = AjaxKit.getPath(WsPath.queryExist, { type: typeOrPath });
            }
            try {
                const resp = await Ajax.post<{ exist: boolean }>(
                    ajaxPath,
                    {
                        key: value,
                    },
                    { ...AjaxCfg.FormRequestConfig }
                );
                if (resp.data.exist) {
                    return Promise.reject(message);
                }
            } catch (e) {
                if (errHandler != null) {
                    errHandler(e);
                }
            }

            return true;
        },
    };
};

export const checked = (message: string, config?: RuleObject | null): RuleObject => {
    return {
        validator: (rule, value): Promise<unknown> => {
            if (value !== true) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        },
    };
};

export const password = (userId: number, message: string, config?: RuleObject | null): RuleObject => {
    return {
        ...config,
        validator: async (rule, value): Promise<unknown> => {
            if (value == null || (typeof value === "string" && value.length === 0)) {
                return true;
            }
            const ajaxPath = AjaxKit.getPath(WsPath.password, { id: userId });

            try {
                const resp = await Ajax.post<{ valid: boolean }>(
                    AjaxKit.getURL(ajaxPath, { validate: "yes" }),
                    {
                        password: value,
                    },
                    {
                        ...AjaxCfg.FormRequestConfig,
                    }
                );
                if (!resp.data.valid) {
                    return Promise.reject(message);
                }
            } catch (e) {
                return Promise.reject(message);
            }

            return true;
        },
    };
};
