import { defineMessages, FormattedMessage } from "react-intl";
import React, { ReactElement } from "react";
import { Button, Space } from "antd";
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import { RegisterByEmail, RegisterByMobile } from "./register";
import PageLayout, { PageForm } from "./template/PageLayout";
import { AppleOutlined, WechatOutlined, MailOutlined, MobileOutlined } from "@ant-design/icons";
import "./Registration.less";
export const Registration: React.FC = (): ReactElement => {
    return (
        <PageLayout className={"reg"}>
            <Switch>
                <Route exact path="/reg/email" component={RegisterByEmail} />
                <Route exact path="/reg/wechat" component={RegisterByMobile} />
                <Route>
                    <RegistrationIndex />
                </Route>
            </Switch>
        </PageLayout>
    );
};

const regMessages = defineMessages({
    description: {
        id: "reg.description",
        defaultMessage: "Create your SPWR account",
    },
    registerByApple: {
        id: "reg.byAppleID",
        defaultMessage: "Register by Apple ID",
    },
    registerByGoogle: {
        id: "reg.byWechat",
        defaultMessage: "Register by WeChat",
    },
    registerByMobile: {
        id: "reg.byMobile",
        defaultMessage: "Register by Mobile",
    },
    registerByEmail: {
        id: "reg.byEmail",
        defaultMessage: "Register by Email",
    },
    haveAccount: {
        id: "reg.haveAccount",
        defaultMessage: "Already have an account?",
    },
    backToLogin: {
        id: "reg.backToLogin",
        defaultMessage: "Click here to login.",
    },
});

const RegistrationIndex: React.FC = (): ReactElement => {
    return (
        <PageForm title={"Registration"} className={"reg-index"} description={""}>
            <Space direction="vertical" className={"form-block"} size={"middle"}>
                <Link to={"/reg/apple"}>
                    <Button size={"large"} block={true} icon={<AppleOutlined />} className="button-black">
                        <FormattedMessage {...regMessages.registerByApple} />
                    </Button>
                </Link>
                <Link to={"/reg/wechat"}>
                    <Button size={"large"} block={true} className={"button-green"} icon={<WechatOutlined />}>
                        <FormattedMessage {...regMessages.registerByGoogle} />
                    </Button>
                </Link>
                <Link to={"/reg/mobile"}>
                    <Button size={"large"} block={true} icon={<MobileOutlined />} className="button-gray">
                        <FormattedMessage {...regMessages.registerByMobile} />
                    </Button>
                </Link>
                <Link to={"/reg/email"}>
                    <Button size={"large"} type={"primary"} block={true} icon={<MailOutlined />}>
                        <FormattedMessage {...regMessages.registerByEmail} />
                    </Button>
                </Link>
                <p>
                    <FormattedMessage {...regMessages.haveAccount} />{" "}
                    <Link to={"/login"}>
                        <FormattedMessage {...regMessages.backToLogin} />
                    </Link>
                </p>
            </Space>
        </PageForm>
    );
};
// export default Registration;
