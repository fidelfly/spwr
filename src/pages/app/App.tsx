import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { AsyncDispatch, LoadingIndicator, StoreState } from "../../type";
import { appMessages } from "../../constants";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Spin, Button, Layout } from "antd";
import { loadUser } from "../../actions";
import { Switch, Route } from "react-router";

import { Header as AppHeader } from "./AppHeader";
import { SiderMenu } from "./SiderMenu";
import "./home.less";
import { Home } from "../../views";

const { Header, Sider, Footer, Content } = Layout;
/*
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
type AppProps = IntlProps & ReduxProps & RouteChildrenProps & Props;

class AppView extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount(): void {
        const { dispatch } = this.props;
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
                    <Header style={{ padding: 0 }} className={"App-Header"}>
                        <a href="#" className="trigger" onClick={this.toggle}>
                            {this.props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </a>
                        <AppHeader />
                    </Header>
                    <Content className={"App-Content"}>
                        <Switch>
                            <Route exact path="/app/home" component={Home} />
                            {/!*                         <Route exact path="/app/profile/user" component={UserPage} />
                            <Route exact path="/app/profile/password" component={Password} />*!/}
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
*/

// export const AppPage = withAuthorizeCheck(App, Login);

export const AppPage: React.FC = (): ReactElement => {
    const [loading, setLoading] = useState<boolean>(true);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const userId = useSelector<StoreState, number>((state) => state.token.userId);
    const dispatch = useDispatch<AsyncDispatch>();
    const viewLoadingEnable = useSelector<StoreState, LoadingIndicator>((state) => state.layout.viewLoading);

    useEffect(() => {
        setLoading(true);
        dispatch(loadUser(userId))
            .catch((e) => console.log(e))
            .finally(() => {
                setLoading(false);
            });
    }, [dispatch, userId]);

    function toggle(): void {
        setCollapsed(!collapsed);
    }

    const intl = useIntl();
    if (loading) {
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
            <Sider className={"App-Sider"} collapsed={collapsed} theme={"dark"} width={300} trigger={null}>
                <div className="App-Logo">
                    <FormattedMessage {...(collapsed ? appMessages.shortName : appMessages.name)} />
                </div>
                <SiderMenu className={"App-Menu"} collapsed={collapsed} theme={"dark"} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0 }} className={"App-Header"}>
                    <Button type={"link"} className="trigger" onClick={toggle}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                    <AppHeader />
                </Header>
                <Content className={"App-Content"}>
                    <Spin
                        size={"large"}
                        spinning={viewLoadingEnable.status}
                        delay={50}
                        wrapperClassName={"view-loading"}
                        tip={viewLoadingEnable.tip || intl.formatMessage(appMessages.loading)}>
                        <Switch>
                            <Route exact path="/app/home" component={Home} />
                            {/*        <Route exact path="/app/profile/user" component={UserPage} />
                            <Route exact path="/app/profile/password" component={Password} />*/}
                        </Switch>
                    </Spin>
                </Content>
                <Footer className="App-Footer">
                    <FormattedMessage {...appMessages.copyright} />
                </Footer>
            </Layout>
        </Layout>
    );
};
