import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { AsyncDispatch, LoadingIndicator, StoreState } from "../../type";
import { appMessages } from "../../constants";
import { Link } from "react-router-dom";
import { Spin, Button, Layout } from "antd";
import { loadUser } from "../../actions";
import { Switch, Route } from "react-router";

import { Header as AppHeader } from "./AppHeader";
import { SideMenu } from "./SideMenu";
import "./home.less";
import { Home } from "../views";
import snowflake from "../../assets/image/snowflake.png";
import { MenuIcon } from "../../icons";
import { Profile } from "../views/Profile";
const { Header, Sider, Footer, Content } = Layout;

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
        <Layout className={"app" + (collapsed ? " menu-collapsed" : "")}>
            <Sider
                className={"app-sider"}
                collapsed={collapsed}
                theme={"light"}
                collapsedWidth={80}
                width={300}
                trigger={null}>
                <div className="app-logo">
                    <Link to={"/app/home"}>
                        <img src={snowflake} alt={"logo"} height={30} />

                        {!collapsed && (
                            <span className={"app-name"}>
                                <FormattedMessage {...(collapsed ? appMessages.shortName : appMessages.name)} />
                            </span>
                        )}
                    </Link>
                </div>
                <SideMenu className={"app-menu"} collapsed={collapsed} theme={"light"} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0 }} className={"app-header"}>
                    <Button type={"link"} className="menu-trigger" onClick={toggle}>
                        {/*    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}*/}
                        <MenuIcon />
                    </Button>
                    <AppHeader />
                </Header>
                <Content className={"app-content"}>
                    <Spin
                        size={"large"}
                        spinning={viewLoadingEnable.status}
                        delay={50}
                        wrapperClassName={"view-loading"}
                        tip={viewLoadingEnable.tip || intl.formatMessage(appMessages.loading)}>
                        <ViewIndex />
                    </Spin>
                </Content>
                <Footer className="app-footer">
                    <FormattedMessage {...appMessages.copyright} />
                </Footer>
            </Layout>
        </Layout>
    );
};

const ViewIndex: React.FC = (): ReactElement => {
    return (
        <Switch>
            <Route exact path="/app/home" component={Home} />
            <Route path="/app/account" component={Index4Account} />
            <Route>
                <Home />
            </Route>
        </Switch>
    );
};

const Index4Account: React.FC = (): ReactElement => {
    return (
        <Switch>
            <Route path="/app/account/profile" component={Profile} />
        </Switch>
    );
};
