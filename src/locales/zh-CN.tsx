import antdCN from "antd/es/locale/zh_CN";
import cnMessages from "./zh-CN.json";

window.appLocale = window.appLocale || {};

window.appLocale["zh-CN"] = {
    formats: {},
    messages: {
        ...cnMessages,
    },
    antdLocale: antdCN,
    locale: "zh-CN",
};

export default window.appLocale["zh-CN"];
