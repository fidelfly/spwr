import { useIntl } from "react-intl";
import { MessageDescriptor } from "@formatjs/intl/src/types";
import { IntlKit, IntlKitContext, MessageHandler, ValidateRules } from "./IntlKit";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export function useIntlKit(): IntlKit {
    const intlKit = useContext<IntlKit>(IntlKitContext);
    return intlKit;
}

export const useMessage = (): MessageHandler => {
    const intlKit = useIntlKit();
    return intlKit.messageHandler;
};

export const useValidateRules = (): ValidateRules => {
    const intlKit = useIntlKit();
    return intlKit.validateRules;
};

export const useCountDown = (second = 1): [number, Dispatch<SetStateAction<number>>] => {
    const [count, setCount] = useState<number>(-1);
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
    }, [counting]);

    return [count, setCount];
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
