import { Ajax, AjaxMessage } from "../ajax";
import { message } from "antd";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

export type MessageRender = (msg: AjaxMessage) => ReactNode | string;
export const handleMessage = (
    data: unknown,
    msgContent: MessageRender = (msg) => `(${msg.code}) ${msg.message}`
): void => {
    if (Ajax.isMessage(data)) {
        const msg = data as AjaxMessage;
        switch (msg.type) {
            case "debug":
            case "info":
                message.info(msgContent(msg), 10);
                break;
            case "error":
            case "fatal":
                message.error(msgContent(msg), 10);
                break;
            case "warning":
                message.warning(msgContent(msg), 10);
                break;
        }
    }
};

interface AjaxHandlers {
    showMessage(data: unknown, msgContent?: MessageRender): void;
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
    const showMessage = (data: unknown, msgContent: MessageRender = defaultMsgContent) => {
        handleMessage(data, msgContent);
    };
    return {
        showMessage,
    };
};
