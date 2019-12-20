import { Locale } from "antd/lib/locale-provider";

export interface LocaleObject {
    locale: string;
    messages: Record<string, string>;
    formats: object;
    antdLocale: Locale;
}
