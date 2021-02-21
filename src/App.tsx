import React, { ReactElement, useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { IntlProvider, useIntl } from "react-intl";
import store from "./state";
import { appMessages, Language, System } from "./constants";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import "./App.less";
import { LocaleObject } from "./type/locale";
import moment from "moment";
import { LoadingIndicator, StoreState } from "./type";
import { LoginPage, LogoutPage, AppPage } from "./pages";
import { appLoading } from "./actions";

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

const Starter: React.FC<Props> = (): ReactElement => {
    // const [loading, setLoading] = useState<boolean>(true);
    const [appLocales, setLocales] = useState<LocaleObject | null>();
    const language = useSelector<StoreState, string>((state) => state.language);
    const loading = useSelector<StoreState, LoadingIndicator>((state) => state.layout.appLoading);
    const dispatch = useDispatch();
    useEffect(() => {
        // setLoading(true);
        dispatch(appLoading(true));
        getLocale(language)
            .then((localeData) => {
                setLocales(localeData);
            })
            .finally(() => {
                dispatch(appLoading(false));
                // setLoading(false);
            });
    }, [language, dispatch]);

    return (
        <Spin
            size={"large"}
            spinning={loading.status}
            delay={50}
            wrapperClassName={"app-loading"}
            tip={loading.tip || "Loading"}>
            {appLocales && (
                <ConfigProvider locale={appLocales.antdLocale}>
                    <IntlProvider
                        locale={appLocales.locale}
                        messages={appLocales.messages}
                        formats={appLocales.formats}>
                        <AppRouter />
                    </IntlProvider>
                </ConfigProvider>
            )}
        </Spin>
    );
};

const AppRouter: React.FC = () => {
    const intl = useIntl();
    useEffect(() => {
        document.title = intl.formatMessage(appMessages.name);
    });

    return (
        <Switch>
            <Redirect from="/" exact to="/login" />
            <Route path="/app" component={AppPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/logout" component={LogoutPage} />
        </Switch>
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
