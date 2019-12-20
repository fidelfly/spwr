import { LocaleObject } from "./locale";
import { Store } from "redux";

export * from "./store";

declare global {
    interface Window {
        appLocale: { [propName: string]: LocaleObject };
        store: Store;
    }
}
