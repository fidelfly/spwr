import React, { ReactElement } from "react";
import { Provider, connect } from "react-redux";
import { IntlProvider } from "react-intl";
import store from "./state";
import { Language, System } from "./constants";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./App.css";
import { LocaleObject } from "./type/locale";
import moment from "moment";
import { StoreState } from "./type";
import { LoginPage, HomePage, LogoutPage } from "./pages";

import "./style/index.less";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router basename={System.routerBase}>
                <Route component={Starter} />
            </Router>
        </Provider>
    );
};

interface Props {
    language: string;
}

class StarterComponent extends React.Component<Props, object> {
    componentWillUnmount(): void {
        console.log("exit....");
    }

    render(): ReactElement {
        const appLocales = getLocale(this.props.language);
        return (
            <ConfigProvider locale={appLocales.antdLocale}>
                <IntlProvider locale={appLocales.locale} messages={appLocales.messages} formats={appLocales.formats}>
                    <Switch>
                        <Redirect from="/" exact to="/login" />
                        <Route path="/app" component={HomePage} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/logout" component={LogoutPage} />
                    </Switch>
                </IntlProvider>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state: StoreState): Props => ({
    language: state.language,
});

const Starter = connect(mapStateToProps)(StarterComponent);

function getLocale(langCode: string): LocaleObject {
    const code = Language.getLocaleCode(langCode);
    let result: LocaleObject | null = window.appLocale && window.appLocale[code];
    if (!result) {
        switch (code) {
            case "zh-CN":
                require("./locales/zh-CN");
                break;
            case "en-US":
                require("./locales/en-US");
                break;
            default:
                require("./locales/zh-CN");
        }
        result = window.appLocale && window.appLocale[code];
    }
    moment.locale(langCode === Language.en ? "en" : "zh-cn");
    return result as LocaleObject;
}

export default App;
