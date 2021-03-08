import { Ajax, AjaxMessage } from "../ajax";
import {
    handleMessage,
    handleWithNotification,
    MessageConfig,
    MessageRender,
    NotificationConfig,
    NotificationRender,
} from "./message";
import { IntlShape } from "react-intl";
import { MessageDescriptor } from "@formatjs/intl/src/types";
import { appMessages } from "../constants";
import React from "react";
import { checked, unique } from "./validators";
import { RuleObject } from "rc-field-form/lib/interface";

const degraceMD = (message: string | MessageDescriptor): string => {
    if ((message as MessageDescriptor).id != null) {
        const md = message as MessageDescriptor;

        if (md.defaultMessage != null) {
            return md.defaultMessage as string;
        }

        return md.id as string;
    }

    return message as string;
};

export const IntlKitContext = React.createContext<IntlKit>({
    messageHandler: {
        showMessage: handleMessage,
        showNotification: handleWithNotification,
    },
    validateRules: {
        unique: (typeOrPath, message, config, errHandler) => unique(typeOrPath, degraceMD(message), config, errHandler),
        checked: (message, config) => checked(degraceMD(message), config),
    },
});

export interface ValidateRules {
    unique: (
        typeOrPath: string,
        message: string | MessageDescriptor,
        config?: Omit<RuleObject, "validator"> | null,
        errHandler?: (e: unknown) => void
    ) => RuleObject;
    checked: (message: string | MessageDescriptor, config?: Omit<RuleObject, "validator"> | null) => RuleObject;
}

export interface IntlKit {
    messageHandler: MessageHandler;
    validateRules: ValidateRules;
}

export function createIntlKit(intl: IntlShape): IntlKit {
    const resolveMD = (message: string | MessageDescriptor): string => {
        if ((message as MessageDescriptor).id != null) {
            return intl.formatMessage(message as MessageDescriptor);
        }

        return intl.formatMessage({
            id: message as string,
            defaultMessage: message as string,
        });
    };

    const msgHandler = new MessageHandlerImpl(intl);

    const defErrHandler = (e: unknown): void => {
        if (Ajax.isMessage((e as { data: unknown }).data)) {
            msgHandler.showNotification((e as { data: unknown }).data as AjaxMessage);
        } else {
            msgHandler.showNotification({
                code: "validate.unknown.error",
                message: `${e}`,
                type: "error",
            });
        }
    };

    return {
        messageHandler: msgHandler,
        validateRules: {
            unique: (typeOrPath, message, config, errHandler: (e: unknown) => void = defErrHandler) => {
                return unique(typeOrPath, resolveMD(message), config, errHandler);
            },
            checked: (message, config) => {
                return checked(resolveMD(message), config);
            },
        },
    };
}

export interface MessageHandler {
    showMessage: (data: AjaxMessage, config?: MessageConfig | null, msgContent?: MessageRender) => void;
    showNotification: (data: AjaxMessage, config?: NotificationConfig | null, render?: NotificationRender) => void;
}

export class MessageHandlerImpl implements MessageHandler, NotificationRender, MessageRender {
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
