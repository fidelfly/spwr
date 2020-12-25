import { Locale } from "antd/lib/locale-provider";
import { CustomFormats } from "@formatjs/intl";

export interface LocaleObject {
    locale: string;
    messages: Record<string, string>;
    formats: CustomFormats;
    antdLocale: Locale;
}
