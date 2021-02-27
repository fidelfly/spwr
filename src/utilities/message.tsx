import { Ajax, AjaxMessage } from "../ajax";
import { message } from "antd";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { ArgsProps } from "antd/lib/message";

export type MessageConfig = Omit<ArgsProps, "content" | "type">;
export type MessageRender = (msg: AjaxMessage) => ReactNode | string;
export const handleMessage = (
    data: unknown,
    config?: MessageConfig | null,
    msgContent: MessageRender = (msg) => `(${msg.code}) ${msg.message}`
): void => {
    if (Ajax.isMessage(data)) {
        const msg = data as AjaxMessage;
        const msgCfg = {
            content: msgContent(msg),
            ...config,
        };
        switch (msg.type) {
            case "debug":
            case "info":
                message.info(msgCfg);
                break;
            case "error":
            case "fatal":
                message.error(msgCfg);
                break;
            case "warning":
                message.warning(msgCfg);
                break;
            case "success":
                message.success(msgCfg);
                break;
        }
    }
};

interface AjaxHandlers {
    showMessage(data: unknown, config?: MessageConfig | null, msgContent?: MessageRender): void;
}

export const useAjaxHandler = (): AjaxHandlers => {
    const intl = useIntl();
    const defaultMsgContent: MessageRender = (msg: AjaxMessage): ReactNode | string => {
        return intl.formatMessage({
            id: msg.code,
            defaultMessage: `(${msg.code}) ${msg.message}`,
        });
        // return <FormattedMessage id={msg.code} defaultMessage={`(${msg.code}) ${msg.message}`} />;
    };
    const showMessage = (
        data: unknown,
        config?: MessageConfig | null,
        msgContent: MessageRender = defaultMsgContent
    ) => {
        handleMessage(data, config, msgContent);
    };
    return {
        showMessage,
    };
};
