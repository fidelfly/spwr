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
import { useMemo } from "react";

interface MessageHandler {
    showMessage(data: AjaxMessage, config?: MessageConfig | null, msgContent?: MessageRender): void;
    showNotification(data: AjaxMessage, config?: NotificationConfig | null, render?: NotificationRender): void;
}

class MessageHandlerImpl implements MessageHandler, NotificationRender, MessageRender {
    intl: IntlShape;
    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    messageContent(msg: AjaxMessage): React.ReactNode | string {
        return this.intl.formatMessage(
            {
                id: msg.code,
                defaultMessage: `(${msg.code}) ${msg.message}`,
            },
            msg.data
        );
    }

    notificationContent(msg: AjaxMessage): React.ReactNode | string {
        return this.intl.formatMessage(
            {
                id: msg.code,
                defaultMessage: `(${msg.code}) ${msg.message}`,
            },
            msg.data
        );
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
        return this.intl.formatMessage(title, msg.data);
    }

    showMessage(data: AjaxMessage, config?: MessageConfig | null, render: MessageRender = this): void {
        handleMessage(data, config, render);
    }

    showNotification(data: AjaxMessage, config?: NotificationConfig | null, render: NotificationRender = this): void {
        handleWithNotification(data, config, render);
    }
}

export const useMessage = (): MessageHandler => {
    const intl = useIntl();
    const msgHandler = useMemo(() => new MessageHandlerImpl(intl), [intl]);
    return msgHandler;
};
