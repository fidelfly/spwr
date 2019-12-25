import { LocaleObject } from "./locale";
import { Store } from "redux";

export * from "./store";

export * from "./components";

declare global {
    interface Window {
        appLocale: { [propName: string]: LocaleObject };
        store: Store;
    }
}
