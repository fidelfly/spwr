import React, { ReactElement } from "react";
import ViewLayout, { ViewHeader, ViewContent } from "../template/ViewLayout";
import { BreadcrumbRoute, PathBreadcrumb } from "../../components/PathBreadcrumb";
import { defineMessages, FormattedMessage } from "react-intl";
import { appMessages } from "../../constants";
import { Route, Switch, Link } from "react-router-dom";
import { Button } from "antd";
import { CaretRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const viewMessage = defineMessages({
    title: {
        id: "menu.account.profile",
        defaultMessage: "Profile",
    },
});

const myRoutes: BreadcrumbRoute = {
    path: "/",
    title: <FormattedMessage {...viewMessage.title} />,
    children: [
        {
            path: "/e",
            title: <FormattedMessage {...appMessages.edit} />,
        },
    ],
};

export const Profile: React.FC = (): ReactElement => {
    return (
        <ViewLayout>
            <PathBreadcrumb
                base="/app/account/profile"
                routes={myRoutes}
                className={"view-breadcrumb"}
                separator={<CaretRightOutlined />}
            />
            <Switch>
                <Route exact path={"/app/account/profile/e"} component={ProfileEditor} />
                <Route>
                    <ProfileView />
                </Route>
            </Switch>
        </ViewLayout>
    );
};

const ProfileView: React.FC = (): ReactElement => {
    return (
        <ViewContent>
            <ViewHeader
                toolbar={[
                    <Link to={"/app/account/profile/e"} key={"edit"}>
                        <Button type={"primary"}>
                            <FormattedMessage {...appMessages.edit} />
                        </Button>
                    </Link>,
                ]}
            />
            <p>{"Profile View"}</p>
        </ViewContent>
    );
};

const ProfileEditor: React.FC = (): ReactElement => {
    return (
        <ViewContent>
            <ViewHeader
                toolbar={[
                    <Button type={"primary"}>
                        <FormattedMessage {...appMessages.save} />
                    </Button>,
                ]}
                backIcon={
                    <Link to={"/app/account/profile"}>
                        <ArrowLeftOutlined />
                    </Link>
                }
                onBack={() => null}
            />
            <p>{"Profile Editor"}</p>
        </ViewContent>
    );
};
