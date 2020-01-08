import React, { ReactElement, useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import store from "./state";
import { Language, System } from "./constants";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import "./App.css";
import { LocaleObject } from "./type/locale";
import moment from "moment";
import { StoreState } from "./type";
import { LoginPage, AppPage, LogoutPage } from "./pages";

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

const Starter: React.FC<Props> = (props: Props): ReactElement => {
    const [loading, setLoading] = useState<boolean>(true);
    const [appLocales, setLocales] = useState<LocaleObject | null>();
    const language = useSelector<StoreState, string>((state) => state.language);
    useEffect(() => {
        setLoading(true);
        getLocale(language)
            .then((localeData) => {
                setLocales(localeData);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [language]);

    return (
        <Spin spinning={loading} delay={50}>
            {appLocales && (
                <ConfigProvider locale={appLocales.antdLocale}>
                    <IntlProvider
                        locale={appLocales.locale}
                        messages={appLocales.messages}
                        formats={appLocales.formats}>
                        <Switch>
                            <Redirect from="/" exact to="/login" />
                            <Route path="/app" component={AppPage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/logout" component={LogoutPage} />
                        </Switch>
                    </IntlProvider>
                </ConfigProvider>
            )}
        </Spin>
    );
};

/*class StarterComponent extends React.Component<Props, object> {
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
                        <Route path="/app" component={AppPage} />
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
*/
async function getLocale(langCode: string): Promise<LocaleObject> {
    const code = Language.getLocaleCode(langCode);
    let result: LocaleObject | null = window.appLocale && window.appLocale[code];
    if (!result) {
        await import(`./locales/${code}`);
        /*        switch (code) {
            case "zh-CN":
                import("./locales/zh-CN");
                break;
            case "en-US":
                import("./locales/en-US");
                break;
            default:
                import("./locales/zh-CN");
        }*/
        result = window.appLocale && window.appLocale[code];
    }
    moment.locale(langCode === Language.en ? "en" : "zh-cn");
    return result as LocaleObject;
}

export default App;
