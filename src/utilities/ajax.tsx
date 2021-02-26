import { Ajax, AjaxMessage } from "../ajax";
import { message } from "antd";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export type MessageRender = (msg: AjaxMessage) => ReactNode | string;

const defaultMessageContent: MessageRender = (msg: AjaxMessage): ReactNode | string => {
    return <FormattedMessage id={msg.code} defaultMessage={`(${msg.code}) ${msg.message}`} />;
};

export const handlerMessage = (data: unknown, msgContent: MessageRender = defaultMessageContent): void => {
    if (Ajax.isMessage(data)) {
        const msg = data as AjaxMessage;
        switch (msg.type) {
            case "debug":
                message.info(msgContent(msg), 10);
                break;
            case "error":
            case "fatal":
                message.error(msgContent(msg), 10);
                break;
            case "info":
                message.error(msgContent(msg), 10);
                break;
            case "warning":
                message.warning(msgContent(msg), 10);
                break;
        }
    }
};
