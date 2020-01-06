import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormComponentProps } from "antd/lib/form";
import { IntlProps, ReduxProps, StoreState, Token } from "../type";
import { appMessages } from "../constants";
import { Spin, Layout, Icon } from "antd";
import { loadUser, toggleMenu } from "../actions";
import { RouteChildrenProps, Switch, Route } from "react-router";
import { withAuthorizeCheck } from "../auth";
import { Login } from "./Login";
import { Header as AppHeader } from "./app/AppHeader";
import SiderMenu from "./app/SiderMenu";
import "../style/home.less";
import { Home } from "../views";

const { Header, Sider, Footer, Content } = Layout;
interface AppState {
    loading: boolean;
}

interface Props {
    userId: number;
    collapsed: boolean;
    sideTheme?: "dark" | "light";
    sideWidth?: number;
}

const mapStateToProps = (state: StoreState): Props => {
    const { userId } = state.token as Token;
    return {
        userId: userId,
        collapsed: state.layout.collapsed,
        sideTheme: state.layout.theme,
        sideWidth: state.layout.sideWidth,
    };
};

const connector = connect(mapStateToProps);
type AppProps = IntlProps & ReduxProps & RouteChildrenProps & FormComponentProps & Props;

class AppView extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount(): void {
        const { dispatch, intl } = this.props;
        document.title = intl.formatMessage(appMessages.name);
        dispatch(loadUser(this.props.userId))
            .catch((e: any) => {
                console.log(e);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    toggle = (): void => {
        const { dispatch } = this.props;
        dispatch(toggleMenu());
    };

    render(): ReactElement {
        const { intl } = this.props;
        if (this.state.loading) {
            return (
                <Spin
                    size="large"
                    style={{ width: "100%", height: "100%", paddingTop: "10%" }}
                    tip={intl.formatMessage(appMessages.loading)}
                />
            );
        }
        return (
            <Layout className={"App"}>
                <Sider
                    className={"App-Sider"}
                    collapsed={this.props.collapsed}
                    theme={this.props.sideTheme}
                    width={this.props.sideWidth}
                    trigger={null}>
                    <div className="App-Logo">
                        <FormattedMessage {...(this.props.collapsed ? appMessages.shortName : appMessages.name)} />
                    </div>
                    <SiderMenu className={"App-Menu"} />
                </Sider>
                <Layout>
                    <Header style={{ background: "#fff", padding: 0 }} className={"App-Header"}>
                        <Icon
                            className="trigger"
                            type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
                            onClick={this.toggle}
                        />
                        <AppHeader />
                    </Header>
                    <Content className={"App-Content"}>
                        <Switch>
                            <Route exact path="/app/home" component={Home} />
                            {/*                         <Route exact path="/app/profile/user" component={UserPage} />
                            <Route exact path="/app/profile/password" component={Password} />*/}
                        </Switch>
                    </Content>
                    <Footer className="App-Footer">
                        <FormattedMessage {...appMessages.copyright} />
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export const App = injectIntl(connector(AppView));

export const AppPage = withAuthorizeCheck(App, Login);
