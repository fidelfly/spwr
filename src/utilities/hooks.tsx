import { useIntl } from "react-intl";
import { MessageDescriptor } from "@formatjs/intl/src/types";
import { IntlKit, IntlKitContext, MessageHandler, ValidateRules } from "./IntlKit";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../auth";
import { clearToken } from "../actions";

export function useIntlKit(): IntlKit {
    return useContext<IntlKit>(IntlKitContext);
}

export const useMessage = (): MessageHandler => {
    const intlKit = useIntlKit();
    return intlKit.messageHandler;
};

export const useValidateRules = (): ValidateRules => {
    const intlKit = useIntlKit();
    return intlKit.validateRules;
};

type CountDownApi = {
    start: (value: number) => void;
    stop: () => void;
};

export const useCountDown = (second = 1): [number, CountDownApi] => {
    const [count, setCount] = useState<number>(-1);
    const [countValue, counter] = useCount();
    const counting = count >= 0;
    useEffect(() => {
        if (counting) {
            const timer = setInterval(() => {
                setCount((count) => count - 1);
            }, second * 1000);

            return function clearTimer() {
                clearInterval(timer);
            };
        }
    }, [counting, second, countValue]);

    const api = useMemo(() => {
        return {
            start: (initValue: number) => {
                counter.tick();
                setCount(initValue);
            },
            stop: () => {
                counter.tick();
                setCount(-1);
            },
        };
    }, [counter, setCount]);

    return [count, api];
};

type CountAPI = {
    tick: () => void;
};

export const useCount = (): [number, CountAPI] => {
    const [count, setCount] = useState<number>(0);

    const api = useMemo(() => {
        return {
            tick: () => {
                setCount((count) => count + 1);
            },
        };
    }, [setCount]);

    return [count, api];
};

type AuthorizeAPI = {
    logout: () => void;
};
export const useAuthorizeAPI = (): AuthorizeAPI => {
    const dispatch = useDispatch();

    const api = useMemo<AuthorizeAPI>(() => {
        return {
            logout: () => {
                logout().then(() => {
                    dispatch(clearToken());
                });
            },
        };
    }, [dispatch]);

    return api;
};

export const useMessageVars = (vars: Record<string, string | MessageDescriptor>): Record<string, string> => {
    const intl = useIntl();
    const newVars: Record<string, string> = {};
    for (const k in vars) {
        const v = vars[k];
        if (typeof v === "string") {
            newVars[k] = v;
        } else {
            const md = v as MessageDescriptor;
            if (md.id) {
                newVars[k] = intl.formatMessage(md);
            }
        }
    }

    return newVars;
};
