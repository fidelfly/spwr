import { Ajax, AjaxMessage } from "../ajax";
import { message, notification } from "antd";
import { ReactNode } from "react";
import { ArgsProps as MessageProps } from "antd/lib/message";
import { ArgsProps as NotificationProps } from "antd/lib/notification";

export type MessageConfig = Omit<MessageProps, "content" | "type">;
export interface MessageRender {
    messageContent(msg: AjaxMessage): ReactNode | string;
}
const defaultMessageRender = {
    messageContent: (msg: AjaxMessage) => `(${msg.code}) ${msg.message}`,
};
export const handleMessage = (
    data: unknown,
    config?: MessageConfig | null,
    render: MessageRender = defaultMessageRender
): void => {
    if (Ajax.isMessage(data)) {
        const msg = data as AjaxMessage;
        const msgCfg = {
            content: render.messageContent(msg),
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

export type NotificationConfig = Omit<NotificationProps, "message" | "description">;

export interface NotificationRender {
    notificationTitle(msg: AjaxMessage): ReactNode | string;
    notificationContent(msg: AjaxMessage): ReactNode | string;
}
const defaultNotificationRender: NotificationRender = {
    notificationContent(msg: AjaxMessage): React.ReactNode | string {
        return `(${msg.code}) ${msg.message}`;
    },
    notificationTitle(msg: AjaxMessage): React.ReactNode | string {
        return msg.type;
    },
};
export const handleWithNotification = (
    data: unknown,
    config?: NotificationConfig | null,
    render: NotificationRender = defaultNotificationRender
): void => {
    if (Ajax.isMessage(data)) {
        const msg = data as AjaxMessage;
        const notiCfg = {
            message: render.notificationTitle(msg),
            description: render.notificationContent(msg),
            ...config,
        };
        switch (msg.type) {
            case "debug":
            case "info":
                notification.info(notiCfg);
                break;
            case "error":
            case "fatal":
                notification.error(notiCfg);
                break;
            case "warning":
                notification.warning(notiCfg);
                break;
            case "success":
                notification.success(notiCfg);
                break;
        }
    }
};
