import { RuleObject } from "rc-field-form/lib/interface";
import { WsPath } from "../constants";
import { Ajax, AjaxCfg, AjaxKit } from "../ajax";

export const unique = (
    type: string,
    message: string,
    config?: RuleObject | null,
    errHandler?: (e: unknown) => void
): RuleObject => {
    return {
        ...config,
        validator: async (rule, value): Promise<unknown> => {
            try {
                const resp = await Ajax.post<{ exist: boolean }>(
                    AjaxKit.getPath(WsPath.queryExist, { type: type }),
                    {
                        key: value,
                    },
                    AjaxCfg.FormRequestConfig
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
