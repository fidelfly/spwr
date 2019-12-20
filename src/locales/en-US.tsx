import antdEn from "antd/es/locale/en_US";
import enMessages from "./en-US.json";

window.appLocale = window.appLocale || {};

window.appLocale["en-US"] = {
    formats: {},
    messages: {
        ...enMessages,
    },
    antdLocale: antdEn,
    locale: "en-US",
};

export default window.appLocale["en-US"];
