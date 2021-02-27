import { IntlShape, useIntl } from "react-intl";
import { AjaxMessage } from "../ajax";
import {
    handleMessage,
    MessageConfig,
    MessageRender,
    handleWithNotification,
    NotificationConfig,
    NotificationRender,
} from "./message";
import { MessageDescriptor } from "@formatjs/intl/src/types";
import { appMessages } from "../constants";

interface MessageHandler {
    showMessage(data: unknown, config?: MessageConfig | null, msgContent?: MessageRender): void;
    showNotification(data: unknown, config?: NotificationConfig | null, render?: NotificationRender): void;
}

class MessageHandlerImpl implements MessageHandler, NotificationRender, MessageRender {
    intl: IntlShape;
    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    messageContent(msg: AjaxMessage): React.ReactNode | string {
        return this.intl.formatMessage({
            id: msg.code,
            defaultMessage: `(${msg.code}) ${msg.message}`,
        });
    }

    notificationContent(msg: AjaxMessage): React.ReactNode | string {
        return this.intl.formatMessage({
            id: msg.code,
            defaultMessage: `(${msg.code}) ${msg.message}`,
        });
    }

    notificationTitle(msg: AjaxMessage): React.ReactNode | string {
        let title: MessageDescriptor = appMessages.infoMsg;
        switch (msg.type) {
            case "debug":
                title = appMessages.debugMsg;
                break;
            case "info":
            case "success":
                title = appMessages.infoMsg;
                break;
            case "error":
            case "fatal":
                title = appMessages.errorMsg;
                break;
            case "warning":
                title = appMessages.warningMsg;
                break;
        }
        return this.intl.formatMessage(title);
    }

    showMessage(data: unknown, config?: MessageConfig | null, msgContent?: MessageRender): void {
        handleMessage(data, config, this);
    }

    showNotification(data: unknown, config?: NotificationConfig | null, render?: NotificationRender): void {
        handleWithNotification(data, config, this);
    }
}

export const useMessage = (): MessageHandler => {
    const intl = useIntl();
    return new MessageHandlerImpl(intl);
};
